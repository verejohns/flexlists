import React from "react";
import { Box, TextField, Link, Typography } from "@mui/material";
import { ViewField } from "src/models/ViewField";
import { useTheme } from "@mui/material/styles";
type LinkModel = {
  name: string;
  linkValue: string;
};
interface LinkFieldInputProps {
  isError?: boolean;
  column: ViewField;
  name: string;
  mode: string;
  selectedLink: LinkModel;
  onLinkChange: (link: LinkModel) => void;
}

export default function LinkFieldInput({
  isError,
  column,
  name,
  mode,
  selectedLink,
  onLinkChange,
}: LinkFieldInputProps) {
  const theme = useTheme();
  return (
    <div className="focusedNeed" tabIndex={8}>
      <Box
        key={column.id}
        className="markdownBox"
        sx={{
          border: "1px solid rgba(158, 158, 158, 0.32)",
          p: 2,
          position: "relative",
          borderRadius: "6px",
          ".focusedNeed:focus &": {},
          "&:hover": {},
        }}
      >
        <Typography
          variant="body2"
          component={"label"}
          sx={{
            textTransform: "capitalize",
            fontSize: 12,
            position: "absolute",
            top: "-10px",
            left: "10px",
            background: theme.palette.palette_style.background.default,
            color:
              theme.palette.mode === "light"
                ? "rgba(0, 0, 0, 0.6)"
                : "rgba(255, 255, 255, 0.7)",
            zIndex: 2,
            px: 0.5,
          }}
        >
          {name}
        </Typography>
        {mode !== "view" ? (
          <>
            <TextField
              key={`${column.id}-link`}
              style={{ width: "100%", marginBottom: "15px" }}
              label="Link"
              InputLabelProps={{ shrink: true }}
              name={`${column.id}-link`}
              size="small"
              type={"text"}
              onChange={(e) => {
                let newLink = Object.assign({}, selectedLink);
                newLink.linkValue = e.target.value;
                onLinkChange(newLink);
              }}
              value={selectedLink.linkValue}
              rows={4}
              required={column.required}
              error={isError}
            />
            <TextField
              key={`${column.id}-name`}
              style={{ width: "100%" }}
              label="Name(Optional)"
              InputLabelProps={{ shrink: true }}
              name={`${column.id}-name`}
              size="small"
              type={"text"}
              onChange={(e) => {
                let newLink = Object.assign({}, selectedLink);
                newLink.name = e.target.value;
                onLinkChange(newLink);
              }}
              value={selectedLink.name}
            />
          </>
        ) : (
          <>
            <Box
              className="markdownWrapper"
              sx={{
                ".focusedNeed:focus &": {
                  // margin: "-1px",
                },
              }}
            >
              {selectedLink ? (
                <Link
                  rel="noopener noreferrer"
                  href={selectedLink.linkValue}
                  target="_blank"
                >
                  {selectedLink.name
                    ? selectedLink.name
                    : selectedLink.linkValue}
                </Link>
              ) : (
                <></>
              )}
            </Box>
          </>
        )}
      </Box>
    </div>
  );
}
