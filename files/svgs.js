
const SVG = ({svg}) => {

  const selectSVG = (svg) => {
    switch(svg){
      case 'checkmark':
        return <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
          <title>Checkmark</title>
          <path d="M27 4l-15 15-7-7-5 5 12 12 20-20z"></path>
        </svg>  
        break;
      default:
        break
    }
  }
  
  return (
    <>
      {selectSVG(svg)}
    </>
  )
}

export default SVG
