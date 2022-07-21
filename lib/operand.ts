import { OperandV3 } from "@operandinc/sdk";

const operand = new OperandV3(
  process.env.OPERAND_API_KEY as string,
  process.env.NEXT_PUBLIC_OPERAND_ENDPOINT as string
);

export { operand };
