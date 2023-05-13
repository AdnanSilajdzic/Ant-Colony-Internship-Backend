import { RequestHandler } from 'express';
import createHttpError from 'http-errors';

import * as EmployeesInterfaces from '../interfaces/employees';
import { EmployeeModel } from '../models/employee';
import { UserModel, UserRole } from '../models/user';

export const getEmployees: RequestHandler<unknown, EmployeesInterfaces.GetEmployeesRes[], unknown, unknown> = async (
	req,
	res,
	next
) => {
	try {
		const employees = await EmployeeModel.find();

		const employeesResponse = employees.map(employee => ({
			id: employee._id,
			firstName: employee.firstName,
			lastName: employee.lastName,
			department: employee.department,
			salary: employee.salary,
			techStack: employee.techStack,
		}));

		return res.status(200).json(employeesResponse);
	} catch (error) {
		next(error);
	}
};

export const getEmployeeById: RequestHandler<
	EmployeesInterfaces.GetEmployeeByIdParams,
	EmployeesInterfaces.GetEmployeeByIdRes,
	unknown,
	unknown
> = async (req, res, next) => {
	try {
		const employeeId = req.params.employeeId;

		const employee = await EmployeeModel.findById(employeeId);
		if (!employee) throw createHttpError(404, 'Employee not found.');

		const employeeResponse = {
			id: employee._id,
			firstName: employee.firstName,
			lastName: employee.lastName,
			department: employee.department,
			salary: employee.salary,
			techStack: employee.techStack,
		};

		return res.status(200).json(employeeResponse);
	} catch (error) {
		next(error);
	}
};

export const addEmployee: RequestHandler<
	unknown,
	EmployeesInterfaces.AddEmployeeRes,
	EmployeesInterfaces.AddEmployeeReq,
	unknown
> = async (req, res, next) => {
	try {
		const userId = req.body.userId;

		const user = await UserModel.findById(userId);
		if (!user) throw createHttpError(404, 'User not found.');

		if (user.role !== UserRole.Admin) throw createHttpError(403, 'This user is not allowed to add employees.');

		const { firstName, lastName, department, salary, techStack } = req.body;

		if (!firstName || !lastName || !department || !salary || !techStack)
			throw createHttpError(400, 'Missing required fields.');

		const employee = await EmployeeModel.create({
			firstName,
			lastName,
			department,
			salary,
			techStack,
		});

		const employeeResponse = {
			id: employee._id,
			firstName: employee.firstName,
			lastName: employee.lastName,
			department: employee.department,
			salary: employee.salary,
			techStack: employee.techStack,
		};

		return res.status(201).json(employeeResponse);
	} catch (error) {
		next(error);
	}
};

export const removeEmployee: RequestHandler<
	EmployeesInterfaces.RemoveEmployeeParams,
	unknown,
	EmployeesInterfaces.RemoveEmployeeReq,
	unknown
> = async (req, res, next) => {
	try {
		const employeeId = req.params.employeeId;

		const employee = await EmployeeModel.findById(employeeId);
		if (!employee) throw createHttpError(404, 'Employee not found.');

		const userId = req.body.userId;

		const user = await UserModel.findById(userId);
		if (!user) throw createHttpError(404, 'User not found.');

		if (user.role !== UserRole.Admin) throw createHttpError(403, 'This user is not allowed to remove employees.');

		const userWhoIsEmployee = await UserModel.findOne({ employee: employeeId });
		if (userWhoIsEmployee && userWhoIsEmployee.id === userId)
			throw createHttpError(403, 'You are not authorized to delete yourself.');
		if (userWhoIsEmployee && userWhoIsEmployee.role === UserRole.Admin)
			throw createHttpError(403, 'Cannot delete an admin user.');

		await employee.deleteOne();
		await userWhoIsEmployee?.deleteOne();

		return res.status(200).json({ message: 'Employee removed successfully.' });
	} catch (error) {
		next(error);
	}
};