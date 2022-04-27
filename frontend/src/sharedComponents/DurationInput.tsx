import React from 'react'

const HOUR_IN_MINUTES = 60
const DAY_IN_MINUTES = HOUR_IN_MINUTES * 24

const MIN_VALUE = 0
const MAX_VALUE = DAY_IN_MINUTES

const timeFromSeconds = (seconds: number) => {
	return '01:24'
}

const secondsFromTime = (time: string) => {
	return 10
}

function DurationInput(){

  const [value, setValue] = React.useState(0);
  const [tempValue, setTempValue] = React.useState(timeFromSeconds(value));

  const BUTTON_INCREMENT = 1

  function setSeconds(new_seconds_value: number){
      
    if( new_seconds_value < MIN_VALUE ){
      new_seconds_value = MIN_VALUE;
    }

    if( new_seconds_value > MAX_VALUE ){
      new_seconds_value = MAX_VALUE;
    }
    setValue(new_seconds_value);
    setTempValue(timeFromSeconds(new_seconds_value));
  }

//   function onChange(event: Event){

//     setTempValue(e.target.value);

//     const parsed_seconds = secondsFromTime(e.target.value);
    
//     if( parsed_seconds != null ){

//       props.onChange && props.onChange(parsed_seconds);
//     }
//   }

//   function onBlur(e){

//     const parsed_seconds = secondsFromTime(e.target.value);

//     if( parsed_seconds == null ){

//       setTempValue(timeFromSeconds(value));
    
//     }else{

//       setSeconds(parsed_seconds);
//     }
//   }

  return (

    <span>

      <input
        name={'timer'}
        type='text'
        pattern='^([0-9]+):([0-9]+):([0-9]+([\.|,][0-9+]*)?)$'
        // onChange={ onChange }
        value={ tempValue }
        // style={ INPUT_STYLES }
        // onBlur={ onBlur }
      />
    </span>
  )
}

export default DurationInput