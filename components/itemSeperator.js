import { View } from "react-native";
import { colors } from "../styles/theme";

const itemSeperator = () => {
   return (
      <View style={{ width: "100%", backgroundColor: colors.black, height: 1 }} />
   );
};

export default itemSeperator;