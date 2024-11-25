import { Autocomplete, TextField } from "@mui/material";
import { useEffect } from "react";
import { connect } from "react-redux";
import { getIdFromUserFieldData } from "src/utils/flexlistHelper";

type ViewUserSelectProps = {
  name: string;
  selectedUserData: string;
  isModeView: boolean;
  allViewUsers: any[];
  isMultiple?: boolean;
  setSelectedUserData: (user: string) => void;
  label?: string;
};

const ViewUserSelect = ({
  allViewUsers,
  name,
  selectedUserData,
  isModeView = false,
  isMultiple,
  setSelectedUserData,
  label,
}: ViewUserSelectProps) => {
  useEffect(() => {
    if (!selectedUserData) {
      setSelectedUserData(
        `${allViewUsers[0].name} (${allViewUsers[0].userId})`
      );
    }
  }, []);

  const getSelctedUsers = () => {
    if (selectedUserData) {
      const selectedUsers = selectedUserData.split("; ");
      const newUsers = allViewUsers.filter((x: any) =>
        selectedUsers.find(
          (selectedUser: string) =>
            parseInt(getIdFromUserFieldData(selectedUser)) === x.userId
        )
      );

      if (isMultiple) return newUsers;
      else return newUsers[0];
    } else {
      if (allViewUsers.length > 0) {
        if (isMultiple) return [allViewUsers[0]];
        else return allViewUsers[0];
      }
    }
  };

  return (
   
      <Autocomplete
        id="user_field_lists"
        value={getSelctedUsers()}
        onChange={(event: any, newValue: any) => {
          if (isMultiple) {
            let newUserData = "";

            newValue.map((user: any) => {
              newUserData += newUserData
                ? `; ${user.name} (${user.userId})`
                : `${user.name} (${user.userId})`;
            });

            setSelectedUserData(newUserData);
          } else {
            setSelectedUserData(
              newValue ? `${newValue.name} (${newValue.userId})` : ""
            );
          }
        }}
        options={allViewUsers}
        getOptionLabel={(option) => option?.name}
        fullWidth
        sx={{ my: 1 }}
        multiple={isMultiple}
        disabled={isModeView}
        renderInput={(params) => {
          return (
            <TextField
              {...params}
              label={label ? label:  name ? name : "users"}
              InputLabelProps={{ shrink: true }}
            />
          );
        }}
      />
    
  );
};

const mapStateToProps = (state: any) => ({
  allViewUsers: state.view.allUsers,
});

export default connect(mapStateToProps)(ViewUserSelect);
