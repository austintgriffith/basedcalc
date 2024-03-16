"use client";

////
import { useEffect, useState } from "react";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

type Operation = "add" | "sub" | "mul" | "div";

const Home = () => {
  const [primaryDisplay, setPrimaryDisplay] = useState("");
  const [secondaryDisplay, setSecondaryDisplay] = useState("");
  const [firstOperand, setFirstOperand] = useState<string>("");
  const [secondOperand, setSecondOperand] = useState<string>("");
  const [operation, setOperation] = useState<Operation | "">("");
  const [awaitingSecondOperand, setAwaitingSecondOperand] = useState(false);

  // Adjust the initial state to reflect a valid operation and its arguments
  const [functionName, setFunctionName] = useState<Operation>("add");
  const [args, setArgs] = useState<[bigint, bigint]>([0n, 0n]);

  const { data, refetch } = useScaffoldContractRead({
    contractName: "YourContract",
    functionName: functionName,
    args,
  });

  useEffect(() => {
    if (data && operation && firstOperand && secondOperand) {
      setPrimaryDisplay(data.toString());
      setSecondaryDisplay(`${firstOperand} ${operation} ${secondOperand} = ${data.toString()}`);
      setFirstOperand(data.toString()); // Prepare for the next operation
      setSecondOperand("");
      setOperation("");
      setAwaitingSecondOperand(false);
    }
  }, [data, operation, firstOperand, secondOperand]);

  useEffect(() => {
    // Automatically refetch whenever args state is updated
    if (args[0] !== 0n && args[1] !== 0n && functionName) {
      refetch();
    }
  }, [args, functionName, refetch]);

  const performCalculation = () => {
    if (!firstOperand || !secondOperand || !operation) return;
    const operands: [bigint, bigint] = [BigInt(firstOperand), BigInt(secondOperand)];
    setArgs(operands);
    // The refetch will be triggered by the useEffect watching the args and functionName
  };

  const handleNumberPress = (number: string) => {
    if (awaitingSecondOperand) {
      setPrimaryDisplay(number);
      setSecondOperand(number);
      setAwaitingSecondOperand(false);
    } else {
      const newValue = primaryDisplay + number;
      setPrimaryDisplay(newValue);
      if (!operation) {
        setFirstOperand(newValue);
      } else {
        setSecondOperand(newValue);
      }
    }
  };

  const handleOperationPress = (op: Operation) => {
    setFunctionName(op); // Set the function name for the next calculation
    if (!operation && primaryDisplay) {
      setFirstOperand(primaryDisplay);
      setOperation(op);
      setSecondaryDisplay(`${primaryDisplay} ${op}`);
      setPrimaryDisplay(""); // Clear the primary display for the second operand
      setAwaitingSecondOperand(true);
    } else if (firstOperand && operation && primaryDisplay) {
      performCalculation();
      setOperation(op);
    } else if (firstOperand && !primaryDisplay) {
      setOperation(op);
      setSecondaryDisplay(`${firstOperand} ${op}`);
      setPrimaryDisplay("");
    }
  };

  const handleEqualPress = () => {
    performCalculation();
  };

  const clearAll = () => {
    setPrimaryDisplay("");
    setSecondaryDisplay("");
    setFirstOperand("");
    setSecondOperand("");
    setOperation("");
    setAwaitingSecondOperand(false);
    setArgs([0n, 0n]); // Reset args to their initial state
  };

  const getFunctionNameForOperation = (op: string): Operation => {
    switch (op) {
      case "+":
        return "add";
      case "-":
        return "sub";
      case "*":
        return "mul";
      case "/":
        return "div";
      default:
        throw new Error("Invalid operation");
    }
  };

  const buttons = ["1", "2", "3", "+", "4", "5", "6", "-", "7", "8", "9", "*", "C", "0", "=", "/"];

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="calculator bg-white shadow-xl rounded-lg p-5">
          <div className="memory-display bg-gray-200 p-2 text-right text-sm opacity-50">{secondaryDisplay}</div>
          <div className="display bg-gray-200 p-4 text-right text-2xl">{primaryDisplay}</div>
          <div className="grid grid-cols-4 gap-4 mt-4">
            {buttons.map((button, idx) => (
              <button
                key={idx}
                className={`btn ${button === "=" ? "btn-primary" : "btn-outline"} btn-lg`}
                onClick={() => {
                  if (button.match(/[0-9]/)) {
                    handleNumberPress(button);
                  } else if (button === "C") {
                    clearAll();
                  } else if (button === "=") {
                    handleEqualPress();
                  } else {
                    handleOperationPress(getFunctionNameForOperation(button));
                  }
                }}
              >
                {button}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
