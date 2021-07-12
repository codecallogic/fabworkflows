
const SVG = ({svg, classprop}) => {

  const selectSVG = (svg) => {
    switch(svg){
      case 'checkmark':
        return <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
          <title>Checkmark</title>
          <path d="M27 4l-15 15-7-7-5 5 12 12 20-20z"></path>
        </svg>  
        break;

      case 'inventory':
        return <svg version="1.1" className={classprop} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <title>Inventory</title>
          <path d="M20.016 6.984v-3h-16.031v3h16.031zM15 14.016v-2.016h-6v2.016h6zM20.016 2.016q0.75 0 1.359 0.586t0.609 1.383v3.047q0 1.125-0.984 1.688v11.297q0 0.797-0.656 1.383t-1.359 0.586h-13.969q-0.703 0-1.359-0.586t-0.656-1.383v-11.297q-0.984-0.563-0.984-1.688v-3.047q0-0.797 0.609-1.383t1.359-0.586h16.031z"></path>
        </svg>  
        break;

      case 'dropdown-arrow':
        return <svg version="1.1" className={classprop} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <title>Dropdown Arrow</title>
          <path d="M6.984 9.984h10.031l-5.016 5.016z"></path>
        </svg>  
        break;

      case 'circle-thin':
        return <svg version="1.1" className={classprop} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 28">
          <title>Dropdown Arrow</title>
          <path d="M12 4c-5.516 0-10 4.484-10 10s4.484 10 10 10 10-4.484 10-10-4.484-10-10-10zM24 14c0 6.625-5.375 12-12 12s-12-5.375-12-12 5.375-12 12-12v0c6.625 0 12 5.375 12 12z"></path>
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
