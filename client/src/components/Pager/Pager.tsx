import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@chakra-ui/react";
import React from "react";
import { usePagination } from "../../utils/pager";

type Props = {
  take: number;
  setSkip: (value: number) => void;
};

export const Pager: React.FC<Props> = ({ take, setSkip }) => {
  const onPageChange = (currentPage: number) =>
    setSkip((currentPage - 1) * take);
  const { page, next, previous, firstPage } = usePagination(onPageChange);

  return (
    <Box w="100%" display="flex" marginTop="2" justifyContent="center">
      <Breadcrumb separator="" fontWeight="medium" fontSize="lg">
        <BreadcrumbItem>
          <BreadcrumbLink
            onClick={firstPage}
            textDecor="underline"
            marginRight="-4"
          >
            <ChevronLeftIcon />
            <ChevronLeftIcon marginLeft="-2.5" />
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem>
          <BreadcrumbLink onClick={previous}>
            <ChevronLeftIcon />
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem isCurrentPage={true}>
          <BreadcrumbLink>
            <h3>{page}</h3>
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink onClick={next}>
            <ChevronRightIcon />
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
    </Box>
  );
};
