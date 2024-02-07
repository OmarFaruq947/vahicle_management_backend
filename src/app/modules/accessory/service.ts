import { Prisma, PrismaClient } from "@prisma/client";
import { IFilters, IPaginationOptions } from "../../../interfaces/paginationOptions";
import { IGenericResponse } from "../../../interfaces/common";
import { paginationHelpers } from "../../../helpers/paginationHelpers";
import { accessory_fields_constant } from "./interface";

const prisma = new PrismaClient();
const createAccessoryService = async (payload: any) => {
  const result = await prisma.accessory.create({
    data: payload,
  });
  return result;
};

const getAllAccessoryService = async (
  paginatinOptions: IPaginationOptions,
  filterOptions: IFilters
): Promise<IGenericResponse<any>> =>
  // : Promise<IGenericResponse<IUserResponse[]>> =>
  {
    const { searchTerm, ...filterData } = filterOptions;
    const { limit, page, skip } =
      paginationHelpers.calculatePagination(paginatinOptions);
    const andConditions = [];
    //searching code
    if (searchTerm) {
      andConditions.push({
        OR: accessory_fields_constant.map(field => {
          return {
            [field]: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          };
        }),
      });
    }

    //filtering code
    if (Object.keys(filterData).length > 0) {
      andConditions.push({
        AND: Object.keys(filterData).map(key => ({
          [key]: {
            equals: (filterData as any)[key],
          },
        })),
      });
    }

    const whereCondition: Prisma.AccessoryWhereInput =
      andConditions.length > 0 ? { AND: andConditions } : {};
    const result = await prisma.accessory.findMany({
      where: whereCondition,
      skip,
      take: limit,
      orderBy:
        paginatinOptions.sortBy && paginatinOptions.sortOrder
          ? {
              [paginatinOptions.sortBy]: paginatinOptions.sortOrder,
            }
          : { createAt: 'asc' },
      select: {

      },
    });
    const total = await prisma.accessory.count();
    return {
      meta: {
        limit,
        page,
        total,
      },
      data: result,
    };
  };

const getSingleAccessoryService = async (id: string) => {
  const result = await prisma.accessory.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateAccessoryService = async (data: any, id: string) => {
  const result = await prisma.accessory.update({
    where: {
      id: id,
    },
    data,
  });
  return result;
};

const DeleteAccessoryService = async (id: string) => {
  const result = await prisma.accessory.delete({
    where: {
      id,
    },
  });
  return result;
};

export const accessoryService = {
    createAccessoryService,
    getAllAccessoryService,
    getSingleAccessoryService ,
    updateAccessoryService,
    DeleteAccessoryService
}