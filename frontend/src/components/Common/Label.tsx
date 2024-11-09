
import React from "react";
import { Badge } from "flowbite-react"; // Import Flowbite's Badge component

type LabelProps = {
  text: string;
};

const Label: React.FC<LabelProps> = ({ text }) => {
    return <Badge color="gray">{text}</Badge>;
};

export default Label;
