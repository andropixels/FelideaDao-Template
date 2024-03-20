import { useState } from 'react';
import { ValidationError } from 'yup';

import { useQuery } from '@/hooks/useQuery';

import { useContract } from '@/context/contract/ContractContextProvider';
import { addStakeForDaoSchema } from '@/helpers/schemas';
import { validateSchema } from '@/helpers/validateSchema';

import { CONTRACT_MESSAGES } from '@/types/enums';
import { AddStakeForDaoInput } from '@/types/schemaTypes';

export const useAddStakeForDao = (initialArgValues?: AddStakeForDaoInput) => {
  const { contract } = useContract();
  const [validationErrors, setValidationErrors] =
    useState<ValidationError | null>(null);

  const messageInfo = contract?.abi?.findMessage(
    CONTRACT_MESSAGES.ADD_STAKE_FOR_DAO
  );
  const queryInfo = useQuery<unknown, AddStakeForDaoInput>(messageInfo, {
    mutate: true,
    initialArgValues,
  });

  const mutate = async (manualArgs?: AddStakeForDaoInput) => {
    const argValues = manualArgs || queryInfo.argValues;
    const validationError = await validateSchema(
      addStakeForDaoSchema,
      argValues
    );

    if (validationError) {
      return setValidationErrors(validationError);
    }

    return await queryInfo.query(messageInfo, argValues || undefined);
  };

  return {
    ...queryInfo,
    mutate,
    schema: addStakeForDaoSchema,
    validationErrors,
  };
};
