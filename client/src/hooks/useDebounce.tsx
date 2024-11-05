import React, { useEffect, useState } from "react";

const useDebounce = (value: string, delay: number) => {
  const [debouncevalue, setDebouncevalue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncevalue(value);
      console.log("yes working");
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncevalue;
};

export default useDebounce;
