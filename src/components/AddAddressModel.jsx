import { useState } from "react";
import { useAddress } from "../contexts/AddressContext";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

export default function AddAddress() {
  const { addAddress } = useAddress();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    street: "",
    city: "",
    state: "",
    zip: "",
    contact: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (
      !form.street ||
      !form.city ||
      !form.state ||
      !form.zip ||
      !form.contact
    ) {
      alert("Please fill all fields");
      return;
    }

    addAddress({ ...form, id: uuidv4() });
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSave}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Add New Address</h2>

        <input
          name="street"
          placeholder="Street / Area"
          value={form.street}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          name="city"
          placeholder="City"
          value={form.city}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          name="state"
          placeholder="State"
          value={form.state}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          name="zip"
          placeholder="ZIP / Postal Code"
          value={form.zip}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          name="contact"
          placeholder="Contact Number"
          value={form.contact}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded mt-2"
        >
          Save Address
        </button>
      </form>
    </div>
  );
}
