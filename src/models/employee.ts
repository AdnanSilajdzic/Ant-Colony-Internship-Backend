import { InferSchemaType, Schema, model } from "mongoose";

const employeeSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    default: "none",
    required: true,
  },
  salary: {
    type: Number,
    required: true,
    default: 0,
  },
  techStack: {
    type: [String],
    default: [],
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

type Employee = InferSchemaType<typeof employeeSchema>;

const EmployeeModel = model<Employee>("Employee", employeeSchema);

export { EmployeeModel, Employee };
