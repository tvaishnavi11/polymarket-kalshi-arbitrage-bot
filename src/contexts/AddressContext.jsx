import { createContext, useContext, useState, useEffect } from "react";

const AddressContext = createContext();

export const AddressProvider = ({ children }) => {
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("addresses")) || [];
    setAddresses(saved);
  }, []);

  const addAddress = (address) => {
    const updated = [...addresses, address];
    setAddresses(updated);
    localStorage.setItem("addresses", JSON.stringify(updated));
  };

  const updateAddress = (updatedAddress) => {
    const updated = addresses.map((a) =>
      a.id === updatedAddress.id ? updatedAddress : a,
    );
    setAddresses(updated);
    localStorage.setItem("addresses", JSON.stringify(updated));
  };

  const deleteAddress = (id) => {
    const updated = addresses.filter((a) => a.id !== id);
    setAddresses(updated);
    localStorage.setItem("addresses", JSON.stringify(updated));
  };

  return (
    <AddressContext.Provider
      value={{ addresses, addAddress, updateAddress, deleteAddress }}
    >
      {children}
    </AddressContext.Provider>
  );
};

export const useAddress = () => useContext(AddressContext);
