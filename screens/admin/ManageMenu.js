import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import PageHeader from "../../components/PageHeader";

const ManageMenu = () => {
   const navigator = useNavigation();
   return (
      <SafeAreaView>
         <PageHeader heading={"Menu Management"} navigator={navigator} />
      </SafeAreaView>
   );
};
export default ManageMenu;
