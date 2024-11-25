import { connect } from 'react-redux';
import { ApiResponseStatus } from 'src/enums/ApiResponseStatus';
import Unauthorized from './Unauthorized';
import { TranslationText } from 'src/models/SharedModels';

type ErrorProps = {
  errorStatus: ApiResponseStatus,
  translations: TranslationText[];
};

const Error = ({errorStatus,translations}: ErrorProps) => {
  return (
    <>
    {
      errorStatus === ApiResponseStatus.Unauthorized &&
      <Unauthorized translations={translations} />
    }
    </>
    
    
  );
};

const mapStateToProps = (state: any) => ({
});

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(Error);
