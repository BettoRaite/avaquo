import { Outlet } from "react-router-dom";
import { BottomMenu } from "../../components/BottomMenu/BottomMenu";
import { useState } from "react";
import { AdviceCollectionOverlay } from "../../components/AdviceCollectionOverlay/AdviceCollectionOverlay";
import { useLocation } from "react-router-dom";

export function Root() {
  const [showCollectionOverlay, setShowCollectionOverlay] = useState(false);
  const { pathname } = useLocation();

  function handleShowCollectionOverlay() {
    setShowCollectionOverlay(!showCollectionOverlay);
  }
  return (
    <>
      <Outlet />
      {showCollectionOverlay && (
        <AdviceCollectionOverlay onClose={handleShowCollectionOverlay} />
      )}
      <BottomMenu onShowCollectionOverlay={handleShowCollectionOverlay} />
    </>
  );
}
