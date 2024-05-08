import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

function BtnContinueSendChat({ file, setShowChat }) {
  const handleContinueSendChat = (file) => {
    setShowChat(false);
    console.log(file);
};

  return (
    <TouchableOpacity onPress={() => handleContinueSendChat(file)}>
      <Ionicons name="arrow-redo-sharp" size={24} color="#808080" />
    </TouchableOpacity>
  );
}

export default BtnContinueSendChat;
