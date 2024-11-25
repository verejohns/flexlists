import { Paper, PaperProps, Typography } from '@mui/material';
import { useLanguage } from 'src/contexts/LanguageContext';

// ----------------------------------------------------------------------

interface SearchNotFoundProps extends PaperProps {
  searchQuery?: string;
}

export default function SearchNotFound({ searchQuery = '', ...other }: SearchNotFoundProps) {
  const {getLocalizationValue} = useLanguage();
  return (
    <Paper {...other}>
      <Typography gutterBottom align="center" variant="subtitle1">
       {getLocalizationValue('Not found')} 
      </Typography>
      <Typography variant="body2" align="center">
        {getLocalizationValue('NotResultSearchDescription1')} &nbsp;
        <strong>&quot;{searchQuery}&quot;</strong>. {getLocalizationValue('NotResultSearchDescription2')}.
      </Typography>
    </Paper>
  );
}
