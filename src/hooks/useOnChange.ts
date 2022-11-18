import { useState } from "react";

export default function useOnChange(initialValues: { [key: string]: string }) {
  const [values, setValues] = useState(initialValues);

  const handleChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setValues((values) => ({
      ...values,
      [event.target.name]: event.target.value,
    }));
  };

  return {
    values,
    setValues,
    handleChange,
  };
}
