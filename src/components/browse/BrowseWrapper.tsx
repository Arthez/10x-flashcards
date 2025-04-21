import { ConfirmModalProvider } from "../../hooks/useConfirmModal";
import BrowseContent from "./BrowseContent";

const BrowseWrapper = () => {
  return (
    <ConfirmModalProvider>
      <BrowseContent />
    </ConfirmModalProvider>
  );
};

export default BrowseWrapper;
