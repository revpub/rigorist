import { ModalProps } from "antd";

export interface ModalVisibleProps extends ModalProps {
  setModalVisible: (visible: boolean) => void
}