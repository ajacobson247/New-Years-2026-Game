import CluePage from "@/components/CluePage";
import { getClueConfig } from "@/lib/clues";

export default function Clue4() {
  return <CluePage config={getClueConfig("clue_4")} />;
}
