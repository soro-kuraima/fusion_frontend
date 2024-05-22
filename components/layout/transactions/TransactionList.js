import React from "react";

const TransactionList = ({ address, type, amount, date }) => {
  function unixToFormattedTime(unixTime) {
    const date = new Date(unixTime * 1000);

    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    };

    const formattedTime = date
      .toLocaleDateString("en-GB", options)
      .replace(",", "");

    return formattedTime;
  }

  return (
    <li
      className="py-2 px-4 bg-gray-50 border border-green-100 w-full rounded-md flex justify-between items-center"
      style={{
        borderColor: type === "Send" ? "red" : "green",
      }}
    >
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>

        <div>
          <p>{address}</p>
          <p className="text-sm">{type}</p>
        </div>
      </div>

      <div className="text-right">
        <p
          className="text-sm text-medium"
          style={{
            color: type === "Send" ? "red" : "green",
          }}
        >
          {amount}
        </p>
        <p className="text-sm">{unixToFormattedTime(1716387834)}</p>
      </div>
    </li>
  );
};

export default TransactionList;
