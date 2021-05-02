import {
  Box,
  CloseButton,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import useWindowSize from "../../lib/useWindowSize";

interface FilterDrawerProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  initialFocusRef: React.MutableRefObject<undefined>;
}

const FilterDrawer: React.FC<FilterDrawerProps> = ({
  children,
  isOpen,
  onOpen,
  onClose,
  initialFocusRef,
}) => {
  const { width } = useWindowSize();
  useEffect(() => {
    onClose();
  }, [width]);

  return (
    <Drawer
      placement="left"
      onClose={onClose}
      isOpen={isOpen}
      initialFocusRef={initialFocusRef}
    >
      <DrawerOverlay>
        <DrawerContent>
          <DrawerHeader
            borderBottomWidth="1px"
            display="flex"
            justifyContent="space-between"
          >
            {"Filtruoti"}
            <CloseButton onClick={onClose} />
          </DrawerHeader>
          <DrawerBody>{children}</DrawerBody>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};

export default FilterDrawer;
