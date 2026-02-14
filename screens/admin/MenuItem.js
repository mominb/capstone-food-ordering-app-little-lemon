import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import {
   Image,
   KeyboardAvoidingView,
   ScrollView,
   StyleSheet,
   Switch,
   Text,
   TextInput,
   TouchableOpacity,
   View,
} from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import InfoBox from "../../components/InfoBox";
import PageHeader from "../../components/PageHeader";
import * as theme from "../../styles/theme";
import {
   addMenuItem,
   deleteMenuImageByUrl,
   getGlobalSettings,
   updateMenuItem,
   uploadMenuImage,
} from "../../utils/supabase";

const Item = ({ route }) => {
   const navigation = useNavigation();
   const item = route?.params?.item ?? {};
   const [currency, setCurrency] = useState();
   const [itemName, setItemName] = useState(item.name);
   const [itemDescription, setItemDescription] = useState(item.description);
   const [itemPrice, setItemPrice] = useState(item.price?.toString());
   const [itemCategory, setItemCategory] = useState(item.category);
   const [itemDisabled, setItemDisabled] = useState(item.is_disabled);
   const [imageUri, setImageUri] = useState(item.image_url ?? "");
   const [imageChanged, setImageChanged] = useState(false);
   const [imageRemoved, setImageRemoved] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   const isItemExistent = Boolean(item.id);

   const handleSelectImage = async () => {
      const permission =
         await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permission.status !== "granted") {
         Toast.show({ type: "error", text1: "Photo permission denied" });
         return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
         mediaTypes: ImagePicker.MediaTypeOptions.Images,
         allowsEditing: true,
         quality: 0.8,
      });

      if (!result.canceled) {
         setImageUri(result.assets[0].uri);
         setImageChanged(true);
         setImageRemoved(false);
      }
   };

   const handleRemoveImage = () => {
      setImageUri("");
      setImageChanged(true);
      setImageRemoved(true);
   };

   const handleItemUpdate = async () => {
      setIsLoading(true);
      try {
         let imageUrl = item.image_url ?? null;

         if (imageRemoved && item.image_url) {
            const deleteRes = await deleteMenuImageByUrl(item.image_url);
            if (deleteRes?.error) {
               Toast.show({ type: "error", text1: "Image delete failed" });
               setIsLoading(false);
               return;
            }
            imageUrl = null;
         }

         if (imageChanged && imageUri && imageUri !== item.image_url) {
            const uploadRes = await uploadMenuImage({
               uri: imageUri,
               itemId: item.id,
            });
            if (uploadRes?.error) {
               Toast.show({ type: "error", text1: "Image upload failed" });
               setIsLoading(false);
               return;
            }

            if (item.image_url) {
               await deleteMenuImageByUrl(item.image_url);
            }

            imageUrl = uploadRes.publicUrl;
         }

         let res;
         if (!isItemExistent) {
            res = await addMenuItem(
               itemName,
               itemDescription,
               itemPrice,
               itemCategory,
               itemDisabled,
               imageUrl,
            );
         } else {
            res = await updateMenuItem(
               item.id,
               itemName,
               itemDescription,
               itemPrice,
               itemCategory,
               itemDisabled,
               imageUrl,
            );
         }
         setIsLoading(false);
         if (res?.error) {
            Toast.show({ type: "error", text1: "Save failed" });
         } else {
            Toast.show({ type: "success", text1: "Saved successfully" });
            if (navigation.canGoBack()) {
               navigation.goBack();
            }
         }
      } catch (err) {
         console.log(err);
         setIsLoading(false);
         Toast.show({ type: "error", text1: "Save failed" });
      }
   };
   useEffect(() => {
      const fetchSettings = async () => {
         const globalSettings = await getGlobalSettings();
         setCurrency(globalSettings?.[0]?.currency_code);
      };
      fetchSettings();
   }, []);

   return (
      <SafeAreaView style={[styles.container, theme.layout.container]}>
         <Spinner
            visible={isLoading}
            textContent="Loading..."
            textStyle={{ color: theme.colors.white }}
         />
         <PageHeader
            navigation={navigation}
            heading={isItemExistent ? "Edit Item" : "Add Item"}
         />
         {item.is_disabled && (
            <InfoBox
               type="error"
               message="Item is currently disabled and won't be visible to customers."
            />
         )}
         <ScrollView style={styles.container}>
            <View style={styles.infoBox}>
               <Text style={styles.label}>Photo</Text>
               <View style={styles.imageRow}>
                  {imageUri ? (
                     <Image
                        source={{ uri: imageUri }}
                        style={styles.imagePreview}
                     />
                  ) : (
                     <View style={styles.imagePlaceholder}>
                        <Text style={styles.imagePlaceholderText}>
                           No Image
                        </Text>
                     </View>
                  )}
                  <View style={styles.imageActions}>
                     <TouchableOpacity
                        style={styles.imageActionButton}
                        onPress={handleSelectImage}
                     >
                        <Text style={styles.imageActionText}>Select</Text>
                     </TouchableOpacity>
                     {imageUri ? (
                        <TouchableOpacity
                           style={[
                              styles.imageActionButton,
                              styles.imageRemoveButton,
                           ]}
                           onPress={handleRemoveImage}
                        >
                           <Text style={styles.imageRemoveText}>Remove</Text>
                        </TouchableOpacity>
                     ) : null}
                  </View>
               </View>

               <Text style={styles.label}>Name</Text>
               <TextInput
                  style={styles.input}
                  value={itemName}
                  onChangeText={setItemName}
               />

               <Text style={styles.label}>Description</Text>
               <TextInput
                  style={styles.input}
                  value={itemDescription}
                  onChangeText={setItemDescription}
               />

               <Text style={styles.label}>Category</Text>
               <TextInput
                  autoCapitalize="none"
                  style={styles.input}
                  value={itemCategory}
                  onChangeText={setItemCategory}
               />

               <Text style={styles.label}>Price ({currency})</Text>
               <TextInput
                  keyboardType="numeric"
                  style={styles.input}
                  value={itemPrice}
                  onChangeText={setItemPrice}
               />
               <View
                  style={{
                     flexDirection: "row",
                     alignItems: "center",
                     justifyContent: "space-between",
                     marginBottom: 20,
                  }}
               >
                  <Text style={styles.label}>Disable item</Text>
                  <Switch
                     value={itemDisabled}
                     onValueChange={setItemDisabled}
                  />
               </View>
            </View>
         </ScrollView>

         <KeyboardAvoidingView behavior="padding">
            <View>
               <TouchableOpacity
                  onPress={handleItemUpdate}
                  style={styles.button}
               >
                  <Text style={styles.buttonText}>Save</Text>
               </TouchableOpacity>
            </View>
         </KeyboardAvoidingView>
      </SafeAreaView>
   );
};

const styles = StyleSheet.create({
   container: {},
   infoBox: {
      width: "100%",
      padding: 20,
   },
   seperator: {
      width: "100%",
      height: 0.5,
      backgroundColor: theme.colors.black,
   },

   button: {
      alignSelf: "center",
      width: "90%",
      paddingVertical: 12,
      paddingHorizontal: 28,
      borderRadius: 8,
      backgroundColor: theme.colors.secondary,
      borderColor: theme.colors.black,
      borderWidth: 2,
      margin: 10,
   },
   buttonText: {
      ...theme.typography.bodyBold,
      color: theme.colors.black,
      textAlign: "center",
   },
   input: {
      height: 48,
      borderWidth: 2,
      borderColor: theme.colors.primary,
      borderRadius: 8,
      paddingHorizontal: 12,
      marginBottom: 20,
      backgroundColor: theme.colors.tertiary,
   },
   label: {
      ...theme.typography.h3,
      color: theme.colors.black,
      marginBottom: 6,
   },
   imageRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 20,
      gap: 12,
   },
   imagePreview: {
      width: 90,
      height: 90,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: theme.colors.primary,
   },
   imagePlaceholder: {
      width: 90,
      height: 90,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.lightgrey,
      justifyContent: "center",
      alignItems: "center",
   },
   imagePlaceholderText: {
      ...theme.typography.body,
      color: theme.colors.black,
      fontSize: 12,
      textAlign: "center",
   },
   imageActions: {
      flex: 1,
      gap: 8,
   },
   imageActionButton: {
      borderWidth: 2,
      borderColor: theme.colors.primary,
      borderRadius: 8,
      paddingVertical: 8,
      paddingHorizontal: 12,
      backgroundColor: theme.colors.tertiary,
      alignItems: "center",
   },
   imageActionText: {
      ...theme.typography.bodyBold,
      color: theme.colors.black,
   },
   imageRemoveButton: {
      borderColor: theme.colors.red,
      backgroundColor: theme.colors.white,
   },
   imageRemoveText: {
      ...theme.typography.bodyBold,
      color: theme.colors.red,
   },
});

export default Item;
