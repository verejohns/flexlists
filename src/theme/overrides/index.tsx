//
import Card from "./Card";
import Tabs from "./Tabs";
import Paper from "./Paper";
import Input from "./Input";
import Table from "./Table";
import Button from "./Button";
import Tooltip from "./Tooltip";
import Backdrop from "./Backdrop";
import Typography from "./Typography";
import Autocomplete from "./Autocomplete";
import Select from "./Select";

// ----------------------------------------------------------------------

export default function ComponentsOverrides(theme: any) {
  return Object.assign(
    Card(theme),
    Tabs(theme),
    Table(theme),
    Input(theme),
    Paper(theme),
    Button(theme),
    Select(theme),
    Tooltip(theme),
    Backdrop(theme),
    Typography(theme),
    Autocomplete(theme)
  );
}
