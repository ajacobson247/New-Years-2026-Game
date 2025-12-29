import CluePage from "@/components/CluePage";
import { getClueConfig } from "@/lib/clues";

export default function Clue1() {
  return <CluePage config={getClueConfig("clue_1")} />;
}
