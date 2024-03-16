"use client";

import { useState } from "react";
import { Address } from "~~/components/scaffold-eth";
import { useDeployedContractInfo, useScaffoldContractRead } from "~~/hooks/scaffold-eth";

const Home = () => {
  const [display, setDisplay] = useState("");
  const [memoryDisplay, setMemoryDisplay] = useState("");
  const [operation, setOperation] = useState("");
  const [firstOperand, setFirstOperand] = useState("");

  const handleNumberClick = number => {
    setDisplay(prevDisplay => prevDisplay + number);
  };

  const handleOperationClick = op => {
    setOperation(op);
    setFirstOperand(display);
    setMemoryDisplay(`${display} ${op}`);
    setDisplay("");
  };

  const performCalculation = async () => {
    if (!operation || !firstOperand || !display) return;

    // Simulate a contract call. Replace this with your contract read call.
    const result = simulateContractCall(firstOperand, display, operation);

    setMemoryDisplay(`${firstOperand} ${operation} ${display} =`);
    setDisplay(result.toString());
    setOperation("");
    setFirstOperand("");
  };

  const clearDisplay = () => {
    setDisplay("");
    setMemoryDisplay("");
    setOperation("");
    setFirstOperand("");
  };

  // Placeholder function to simulate contract call
  const simulateContractCall = (a, b, op) => {
    switch (op) {
      case "+":
        return parseInt(a) + parseInt(b);
      case "-":
        return parseInt(a) - parseInt(b);
      case "*":
        return parseInt(a) * parseInt(b);
      case "/":
        return parseInt(a) / parseInt(b);
      default:
        return 0;
    }
  };

  const buttons = ["1", "2", "3", "+", "4", "5", "6", "-", "7", "8", "9", "*", "C", "0", "=", "/"];

  const { data: yourContract } = useDeployedContractInfo("YourContract");

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="calculator bg-white shadow-xl rounded-lg">
          <div className="flex items-center justify-center p-4 text-2xl font-bold text-center ">Based Calc</div>
          <div className="flex items-center justify-center p-4 text-2xl font-bold text-center ">
            <Address address={yourContract?.address} />
          </div>

          <div className="memory-display bg-gray-200 p-2 text-right text-sm opacity-50">{memoryDisplay}</div>
          <div className="display bg-gray-200 p-4 text-right text-2xl">{display}</div>
          <div className="grid grid-cols-4 gap-2 p-4">
            {buttons.map((button, idx) => (
              <button
                key={idx}
                className="btn btn-outline btn-lg"
                onClick={() => {
                  if (button.match(/[0-9]/)) {
                    handleNumberClick(button);
                  } else if (button === "C") {
                    clearDisplay();
                  } else if (button === "=") {
                    performCalculation();
                  } else {
                    handleOperationClick(button);
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
