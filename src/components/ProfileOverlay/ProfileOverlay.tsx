import styles from "./profileOverlay.module.css";
import { useAppUserContext } from "../AppUserProvider/appUserContext";
import userIcon from "/public/icons/account_circle_icon.svg";
import { useState } from "react";
import { MdModeEdit, MdCancel, MdSave } from "react-icons/md";
import { useAppUserHandler } from "../AppUserProvider/appUserContext";
import { LockedContent } from "../LockedContent/LockedContent";
import { CloseButton } from "../CloseButton/CloseButton";

type ProfileOverlayProps = {
  onClose: () => void;
};

type InputProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

function EditableInput({ onChange, value }: InputProps) {
  return (
    <div>
      <input
        className="form__input"
        type="text"
        id="inputField"
        value={value}
        aria-label="Enter your new name"
        onChange={onChange}
        aria-describedby="inputHelp"
        placeholder="New name"
        style={{
          marginTop: "0.5rem",
        }}
      />
      <span id="inputHelp" className={styles.hidden}>
        Enter your new name.
      </span>
    </div>
  );
}

type ActionButtonsProps = {
  isEditing: boolean;
  handleEdit: () => void;
  handleSave: () => void;
};

function ActionButtons({
  isEditing,
  handleEdit,
  handleSave,
}: ActionButtonsProps) {
  return (
    <div className={styles.buttonsLayout}>
      <button
        className={styles.button}
        onClick={isEditing ? handleSave : handleEdit}
        type="button"
        aria-label={isEditing ? "Save changes" : "Edit name"}
      >
        {isEditing ? (
          <MdSave className={styles.icon} />
        ) : (
          <MdModeEdit className={styles.icon} />
        )}
      </button>
      {isEditing && (
        <button
          className={styles.button}
          onClick={handleEdit}
          type="button"
          aria-label="Cancel editing"
        >
          <MdCancel className={styles.icon} />
        </button>
      )}
    </div>
  );
}

export function ProfileOverlay({ onClose }: ProfileOverlayProps) {
  const { appUser } = useAppUserContext();
  const [name, setName] = useState(appUser?.name ?? "");
  const [isEditing, setIsEditing] = useState(false);
  const { changeName } = useAppUserHandler();

  const handleSave = async () => {
    await changeName(name);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  let content = <LockedContent onClose={onClose} />;

  if (appUser) {
    content = (
      <div className={styles.contentLayout}>
        <div className={styles.userIconWrapper}>
          <img src={userIcon} alt="User profile icon" />
          <div className={styles.userNameLayout}>
            {isEditing ? (
              <EditableInput value={name} onChange={handleChange} />
            ) : (
              <p className={styles.userName}>{appUser.name}</p>
            )}
          </div>
          <ActionButtons
            isEditing={isEditing}
            handleEdit={handleEdit}
            handleSave={handleSave}
          />
        </div>
      </div>
    );
  }

  return (
    <section className={styles.layout}>
      {content}
      <CloseButton onClose={onClose} />
    </section>
  );
}
