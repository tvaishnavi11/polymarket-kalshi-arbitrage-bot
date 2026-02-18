import { useState } from "react";

const Addresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [text, setText] = useState("");

  const addAddress = () => {
    setAddresses([...addresses, { id: Date.now(), text }]);
    setText("");
  };

  const deleteAddress = (id) => {
    setAddresses(addresses.filter((a) => a.id !== id));
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">Addresses</h1>

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="New Address"
        className="border p-2 mr-2"
      />
      <button onClick={addAddress} className="bg-black text-white px-4 py-2">
        Add
      </button>

      {addresses.map((addr) => (
        <div key={addr.id} className="bg-white p-4 mt-4 rounded shadow">
          {addr.text}
          <button
            onClick={() => deleteAddress(addr.id)}
            className="ml-4 text-red-500"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default Addresses;
