
const SVG = ({svg, classprop}) => {

  const selectSVG = (svg) => {
    switch(svg){
      case 'notification':
        return <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
          <title>Notification</title>
          <path d="M16 3c-3.472 0-6.737 1.352-9.192 3.808s-3.808 5.72-3.808 9.192c0 3.472 1.352 6.737 3.808 9.192s5.72 3.808 9.192 3.808c3.472 0 6.737-1.352 9.192-3.808s3.808-5.72 3.808-9.192c0-3.472-1.352-6.737-3.808-9.192s-5.72-3.808-9.192-3.808zM16 0v0c8.837 0 16 7.163 16 16s-7.163 16-16 16c-8.837 0-16-7.163-16-16s7.163-16 16-16zM14 22h4v4h-4zM14 6h4v12h-4z"></path>
        </svg>  
        break;

      case 'move-file':
        return <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <title>Checkmark</title>
          <path d="M20.016 6h-8.016l-2.016-2.016h-6q-0.797 0-1.383 0.586t-0.586 1.43v12q0 0.844 0.586 1.43t1.383 0.586h16.031q0.797 0 1.383-0.586t0.586-1.43v-9.984q0-0.844-0.586-1.43t-1.383-0.586zM14.016 18v-3h-4.031v-3.984h4.031v-3l4.969 4.969z"></path>
        </svg>  
        break;

      case 'checkmark':
        return <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
          <title>Checkmark</title>
          <path d="M27 4l-15 15-7-7-5 5 12 12 20-20z"></path>
        </svg>  
        break;

      case 'checkmark-2':
        return <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
          <title>Checkmark</title>
          <path d="M28 0h-24c-2.2 0-4 1.8-4 4v24c0 2.2 1.8 4 4 4h24c2.2 0 4-1.8 4-4v-24c0-2.2-1.8-4-4-4zM14 24.828l-7.414-7.414 2.828-2.828 4.586 4.586 9.586-9.586 2.828 2.828-12.414 12.414z"></path>
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

      case 'slab':
        return <svg version="1.1" className={classprop} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
          <title>Slab</title>
          <path d="M28 20v-8l-5-8h-15l-5 8v8h25zM11 21h-8v8h25v-8h-8v1.5c0 1.389-0.894 2.5-1.997 2.5h-5.005c-1.102 0-1.997-1.119-1.997-2.5v-1.5zM11 12h-6.775l4.375-7h13.8l4.375 7h-6.775v1.994c0 1.119-0.894 2.006-1.997 2.006h-5.005c-1.102 0-1.997-0.898-1.997-2.006v-1.994z"></path>
        </svg>  
        break;

      case 'stopwatch':
        return <svg version="1.1" className={classprop} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
          <title>Slab</title>
          <path d="M16 6.038v-2.038h4v-2c0-1.105-0.895-2-2-2h-6c-1.105 0-2 0.895-2 2v2h4v2.038c-6.712 0.511-12 6.119-12 12.962 0 7.18 5.82 13 13 13s13-5.82 13-13c0-6.843-5.288-12.451-12-12.962zM22.071 26.071c-1.889 1.889-4.4 2.929-7.071 2.929s-5.182-1.040-7.071-2.929c-1.889-1.889-2.929-4.4-2.929-7.071s1.040-5.182 2.929-7.071c1.814-1.814 4.201-2.844 6.754-2.923l-0.677 9.813c-0.058 0.822 0.389 1.181 0.995 1.181s1.053-0.36 0.995-1.181l-0.677-9.813c2.552 0.079 4.94 1.11 6.754 2.923 1.889 1.889 2.929 4.4 2.929 7.071s-1.040 5.182-2.929 7.071z"></path>
        </svg>  
        break;

      case 'box':
        return <svg version="1.1" className={classprop} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <title>Box</title>
          <path d="M18.961 6.828l-6.961 4.027-6.961-4.027 6.456-3.689c0.112-0.064 0.232-0.105 0.355-0.124 0.218-0.034 0.445 0.003 0.654 0.124zM11.526 22.961c0.141 0.076 0.303 0.119 0.474 0.119 0.173 0 0.336-0.044 0.478-0.121 0.356-0.058 0.701-0.18 1.017-0.36l7.001-4.001c0.618-0.357 1.060-0.897 1.299-1.514 0.133-0.342 0.202-0.707 0.205-1.084v-8c0-0.478-0.113-0.931-0.314-1.334-0.022-0.071-0.052-0.14-0.091-0.207-0.046-0.079-0.1-0.149-0.162-0.21-0.031-0.043-0.064-0.086-0.097-0.127-0.23-0.286-0.512-0.528-0.831-0.715l-7.009-4.005c-0.61-0.352-1.3-0.465-1.954-0.364-0.363 0.057-0.715 0.179-1.037 0.363l-7.001 4.001c-0.383 0.221-0.699 0.513-0.941 0.85-0.060 0.060-0.114 0.13-0.159 0.207-0.039 0.068-0.070 0.138-0.092 0.21-0.040 0.080-0.076 0.163-0.108 0.246-0.132 0.343-0.201 0.708-0.204 1.078v8.007c0.001 0.71 0.248 1.363 0.664 1.878 0.23 0.286 0.512 0.528 0.831 0.715l7.009 4.005c0.324 0.187 0.67 0.307 1.022 0.362zM11 12.587v7.991l-6.495-3.711c-0.111-0.065-0.207-0.148-0.285-0.245-0.139-0.172-0.22-0.386-0.22-0.622v-7.462zM13 20.578v-7.991l7-4.049v7.462c-0.001 0.121-0.025 0.246-0.070 0.362-0.080 0.206-0.225 0.384-0.426 0.5z"></path>
        </svg>  
        break;

      case 'plus':
        return <svg version="1.1" className={classprop} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <title>Plus</title>
          <path d="M18 10h-4v-4c0-1.104-0.896-2-2-2s-2 0.896-2 2l0.071 4h-4.071c-1.104 0-2 0.896-2 2s0.896 2 2 2l4.071-0.071-0.071 4.071c0 1.104 0.896 2 2 2s2-0.896 2-2v-4.071l4 0.071c1.104 0 2-0.896 2-2s-0.896-2-2-2z"></path>
        </svg>  
        break;

      case 'dollar':
        return <svg version="1.1" className={classprop} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 28">
          <title>Dollar</title>
          <path d="M15.281 18.516c0 3.187-2.281 5.703-5.594 6.25v2.734c0 0.281-0.219 0.5-0.5 0.5h-2.109c-0.266 0-0.5-0.219-0.5-0.5v-2.734c-3.656-0.516-5.656-2.703-5.734-2.797-0.156-0.187-0.172-0.453-0.031-0.641l1.609-2.109c0.078-0.109 0.219-0.172 0.359-0.187s0.281 0.031 0.375 0.141c0.031 0.016 2.219 2.109 4.984 2.109 1.531 0 3.187-0.812 3.187-2.578 0-1.5-1.844-2.234-3.953-3.078-2.812-1.109-6.312-2.516-6.312-6.438 0-2.875 2.25-5.25 5.516-5.875v-2.812c0-0.281 0.234-0.5 0.5-0.5h2.109c0.281 0 0.5 0.219 0.5 0.5v2.75c3.172 0.359 4.859 2.078 4.922 2.141 0.156 0.172 0.187 0.406 0.078 0.594l-1.266 2.281c-0.078 0.141-0.203 0.234-0.359 0.25-0.156 0.031-0.297-0.016-0.422-0.109-0.016-0.016-1.906-1.687-4.25-1.687-1.984 0-3.359 0.984-3.359 2.406 0 1.656 1.906 2.391 4.125 3.25 2.875 1.109 6.125 2.375 6.125 6.141z"></path>
        </svg>  
        break;

      case 'upload':
        return <svg version="1.1" className={classprop} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 28">
          <title>Upload Files</title>
          <path d="M20 13.5c0-0.125-0.047-0.266-0.141-0.359l-5.5-5.5c-0.094-0.094-0.219-0.141-0.359-0.141-0.125 0-0.266 0.047-0.359 0.141l-5.484 5.484c-0.094 0.109-0.156 0.234-0.156 0.375 0 0.281 0.219 0.5 0.5 0.5h3.5v5.5c0 0.266 0.234 0.5 0.5 0.5h3c0.266 0 0.5-0.234 0.5-0.5v-5.5h3.5c0.281 0 0.5-0.234 0.5-0.5zM30 18c0 3.313-2.688 6-6 6h-17c-3.859 0-7-3.141-7-7 0-2.719 1.578-5.187 4.031-6.328-0.016-0.234-0.031-0.453-0.031-0.672 0-4.422 3.578-8 8-8 3.25 0 6.172 1.969 7.406 4.969 0.719-0.625 1.641-0.969 2.594-0.969 2.203 0 4 1.797 4 4 0 0.766-0.219 1.516-0.641 2.156 2.719 0.641 4.641 3.063 4.641 5.844z"></path>
        </svg>  
        break;

      case 'file-image':
        return <svg version="1.1" className={classprop} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 28">
          <title>File Image</title>
          <path d="M22.937 5.938c0.578 0.578 1.062 1.734 1.062 2.562v18c0 0.828-0.672 1.5-1.5 1.5h-21c-0.828 0-1.5-0.672-1.5-1.5v-25c0-0.828 0.672-1.5 1.5-1.5h14c0.828 0 1.984 0.484 2.562 1.062zM16 2.125v5.875h5.875c-0.094-0.266-0.234-0.531-0.344-0.641l-4.891-4.891c-0.109-0.109-0.375-0.25-0.641-0.344zM22 26v-16h-6.5c-0.828 0-1.5-0.672-1.5-1.5v-6.5h-12v24h20zM20 19v5h-16v-3l3-3 2 2 6-6zM7 16c-1.656 0-3-1.344-3-3s1.344-3 3-3 3 1.344 3 3-1.344 3-3 3z"></path>
        </svg>  
        break;

      case 'error':
        return <svg version="1.1" className={classprop} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <title>Error</title>
          <path d="M12.984 12.984v-6h-1.969v6h1.969zM12.984 17.016v-2.016h-1.969v2.016h1.969zM12 2.016q4.125 0 7.055 2.93t2.93 7.055-2.93 7.055-7.055 2.93-7.055-2.93-2.93-7.055 2.93-7.055 7.055-2.93z"></path>
        </svg>  
        break;

      case 'reset':
        return <svg version="1.1" className={classprop} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
          <title>Error</title>
          <path d="M24 18c0 4.414-3.586 8-8 8s-8-3.586-8-8 3.586-8 8-8h4l0.023 4.020 6.012-6.020-6.012-6v4h-4.023c-6.625 0-12 5.375-12 12s5.375 12 12 12 12-5.375 12-12h-4z"></path>
        </svg>  
        break;
        
      case 'sort':
        return <svg version="1.1" className={classprop} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 28">
          <title>Sort</title>
          <path d="M16 17c0 0.266-0.109 0.516-0.297 0.703l-7 7c-0.187 0.187-0.438 0.297-0.703 0.297s-0.516-0.109-0.703-0.297l-7-7c-0.187-0.187-0.297-0.438-0.297-0.703 0-0.547 0.453-1 1-1h14c0.547 0 1 0.453 1 1zM16 11c0 0.547-0.453 1-1 1h-14c-0.547 0-1-0.453-1-1 0-0.266 0.109-0.516 0.297-0.703l7-7c0.187-0.187 0.438-0.297 0.703-0.297s0.516 0.109 0.703 0.297l7 7c0.187 0.187 0.297 0.438 0.297 0.703z"></path>
        </svg>  
        break;
        
      case 'close':
        return <svg version="1.1" className={classprop} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <title>Close</title>
          <path d="M10 8.586l-7.071-7.071-1.414 1.414 7.071 7.071-7.071 7.071 1.414 1.414 7.071-7.071 7.071 7.071 1.414-1.414-7.071-7.071 7.071-7.071-1.414-1.414-7.071 7.071z"></path>
        </svg>  
        break;

      case 'edit':
        return <svg version="1.1" className={classprop} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <title>Edit</title>
          <path d="M12.3 3.7l4 4-12.3 12.3h-4v-4l12.3-12.3zM13.7 2.3l2.3-2.3 4 4-2.3 2.3-4-4z"></path>
        </svg> 

      case 'delete':
        return <svg version="1.1" className={classprop} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <title>Edit</title>
          <path d="M3.389 7.113l1.101 10.908c0.061 0.461 2.287 1.977 5.51 1.979 3.225-0.002 5.451-1.518 5.511-1.979l1.102-10.908c-1.684 0.942-4.201 1.387-6.613 1.387-2.41 0-4.928-0.445-6.611-1.387zM13.168 1.51l-0.859-0.951c-0.332-0.473-0.692-0.559-1.393-0.559h-1.831c-0.7 0-1.061 0.086-1.392 0.559l-0.859 0.951c-2.57 0.449-4.434 1.64-4.434 2.519v0.17c0 1.547 3.403 2.801 7.6 2.801 4.198 0 7.601-1.254 7.601-2.801v-0.17c0-0.879-1.863-2.070-4.433-2.519zM12.070 4.34l-1.070-1.34h-2l-1.068 1.34h-1.7c0 0 1.862-2.221 2.111-2.522 0.19-0.23 0.384-0.318 0.636-0.318h2.043c0.253 0 0.447 0.088 0.637 0.318 0.248 0.301 2.111 2.522 2.111 2.522h-1.7z"></path>
        </svg>  
        break;

      case 'remnant':
        return <svg version="1.1" className={classprop} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
          <title>Edit</title>
          <path d="M0 12h32v20h-32zM18 8h14l-4-8h-10zM14 0h-10l-4 8h14z"></path>
        </svg>  
        break;

      case 'arrow-top':
        return <svg version="1.1" className={classprop} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <title>Edit</title>
          <path d="M7.406 15.422l-1.406-1.406 6-6 6 6-1.406 1.406-4.594-4.594z"></path>
        </svg>  
        break;
      case 'arrow-left':
        return <svg version="1.1" className={classprop} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <title>Edit</title>
          <path d="M15.422 16.594l-1.406 1.406-6-6 6-6 1.406 1.406-4.594 4.594z"></path>
        </svg>  
        break;

      case 'arrow-right':
        return <svg version="1.1" className={classprop} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <title>Edit</title>
          <path d="M8.578 16.594l4.594-4.594-4.594-4.594 1.406-1.406 6 6-6 6z"></path>
        </svg>  
        break;

      case 'arrow-bottom':
        return <svg version="1.1" className={classprop} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <title>Edit</title>
          <path d="M7.406 8.578l4.594 4.594 4.594-4.594 1.406 1.406-6 6-6-6z"></path>
        </svg>  
        break;

      case 'document':
        return <svg version="1.1" className={classprop} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 32">
          <title>Edit</title>
          <path d="M1.5 32h21c0.827 0 1.5-0.673 1.5-1.5v-21c0-0.017-0.008-0.031-0.009-0.047-0.002-0.023-0.008-0.043-0.013-0.065-0.017-0.071-0.046-0.135-0.090-0.191-0.007-0.009-0.006-0.020-0.013-0.029l-8-9c-0.003-0.003-0.007-0.003-0.010-0.006-0.060-0.064-0.136-0.108-0.223-0.134-0.019-0.006-0.036-0.008-0.056-0.011-0.029-0.005-0.056-0.017-0.086-0.017h-14c-0.827 0-1.5 0.673-1.5 1.5v29c0 0.827 0.673 1.5 1.5 1.5zM16 1.815l6.387 7.185h-5.887c-0.22 0-0.5-0.42-0.5-0.75v-6.435zM1 1.5c0-0.276 0.225-0.5 0.5-0.5h13.5v7.25c0 0.809 0.655 1.75 1.5 1.75h6.5v20.5c0 0.276-0.225 0.5-0.5 0.5h-21c-0.28 0-0.5-0.22-0.5-0.5v-29zM5.5 14h13c0.276 0 0.5-0.224 0.5-0.5s-0.224-0.5-0.5-0.5h-13c-0.276 0-0.5 0.224-0.5 0.5s0.224 0.5 0.5 0.5zM5.5 18h13c0.276 0 0.5-0.224 0.5-0.5s-0.224-0.5-0.5-0.5h-13c-0.276 0-0.5 0.224-0.5 0.5s0.224 0.5 0.5 0.5zM5.5 10h6c0.276 0 0.5-0.224 0.5-0.5s-0.224-0.5-0.5-0.5h-6c-0.276 0-0.5 0.224-0.5 0.5s0.224 0.5 0.5 0.5zM5.5 22h13c0.276 0 0.5-0.224 0.5-0.5s-0.224-0.5-0.5-0.5h-13c-0.276 0-0.5 0.224-0.5 0.5s0.224 0.5 0.5 0.5zM5.5 26h13c0.276 0 0.5-0.224 0.5-0.5s-0.224-0.5-0.5-0.5h-13c-0.276 0-0.5 0.224-0.5 0.5s0.224 0.5 0.5 0.5z"></path>
        </svg>  
        break;

      case 'price-list':
        return <svg version="1.1" className={classprop} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
          <title>Edit</title>
          <path d="M25.994 16.144l-12.225-12.225-11.769 0.045 0.018 10.831 12.662 12.662c0.794 0.795 2.072 0.806 2.854 0.024l8.484-8.485c0.781-0.781 0.771-2.058-0.024-2.852zM7.081 10.952c-1.104 0-2-0.896-2-2s0.896-2 2-2c1.105 0 2 0.896 2 2s-0.895 2-2 2zM28.846 16.168l-12.225-12.225-1.471 0.005 12.27 12.207c0.795 0.795 0.805 2.071 0.023 2.853l-8.484 8.485c-0.207 0.207-0.451 0.354-0.709 0.451 0.721 0.277 1.561 0.135 2.135-0.438l8.486-8.485c0.781-0.782 0.77-2.059-0.025-2.853z"></path>
        </svg>  
        break;

      case 'price-list':
        return <svg version="1.1" className={classprop} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
          <title>Edit</title>
          <path d="M25.994 16.144l-12.225-12.225-11.769 0.045 0.018 10.831 12.662 12.662c0.794 0.795 2.072 0.806 2.854 0.024l8.484-8.485c0.781-0.781 0.771-2.058-0.024-2.852zM7.081 10.952c-1.104 0-2-0.896-2-2s0.896-2 2-2c1.105 0 2 0.896 2 2s-0.895 2-2 2zM28.846 16.168l-12.225-12.225-1.471 0.005 12.27 12.207c0.795 0.795 0.805 2.071 0.023 2.853l-8.484 8.485c-0.207 0.207-0.451 0.354-0.709 0.451 0.721 0.277 1.561 0.135 2.135-0.438l8.486-8.485c0.781-0.782 0.77-2.059-0.025-2.853z"></path>
        </svg>  
        break;

      case 'payments':
        return <svg version="1.1" className={classprop} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <title>Payments</title>
          <path d="M18.984 14.016v-8.016q0-0.844-0.586-1.43t-1.383-0.586h-14.016q-0.844 0-1.43 0.586t-0.586 1.43v8.016q0 0.797 0.586 1.383t1.43 0.586h14.016q0.797 0 1.383-0.586t0.586-1.383zM9.984 12.984q-0.797 0-1.477-0.398t-1.102-1.078-0.422-1.523q0-0.797 0.422-1.477t1.102-1.102 1.477-0.422q0.844 0 1.523 0.422t1.078 1.102 0.398 1.477q0 0.844-0.398 1.523t-1.078 1.078-1.523 0.398zM23.016 6.984v11.016q0 0.844-0.586 1.43t-1.43 0.586h-17.016v-2.016h17.016v-11.016h2.016z"></path>
        </svg>  
        break;

      case 'calendar':
        return <svg version="1.1" className={classprop} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
          <title>Calendar</title>
          <path d="M12.048 16.961c-0.178 0.257-0.395 0.901-0.652 1.059-0.257 0.157-0.547 0.267-0.869 0.328-0.323 0.062-0.657 0.089-1.002 0.079v1.527h2.467v6.046h1.991v-9.996h-1.584c-0.056 0.381-0.173 0.7-0.351 0.957zM23 8h2c0.553 0 1-0.448 1-1v-6c0-0.552-0.447-1-1-1h-2c-0.553 0-1 0.448-1 1v6c0 0.552 0.447 1 1 1zM7 8h2c0.552 0 1-0.448 1-1v-6c0-0.552-0.448-1-1-1h-2c-0.552 0-1 0.448-1 1v6c0 0.552 0.448 1 1 1zM30 4h-2v5c0 0.552-0.447 1-1 1h-6c-0.553 0-1-0.448-1-1v-5h-8v5c0 0.552-0.448 1-1 1h-6c-0.552 0-1-0.448-1-1v-5h-2c-1.104 0-2 0.896-2 2v24c0 1.104 0.896 2 2 2h28c1.104 0 2-0.896 2-2v-24c0-1.104-0.896-2-2-2zM30 29c0 0.553-0.447 1-1 1h-26c-0.552 0-1-0.447-1-1v-16c0-0.552 0.448-1 1-1h26c0.553 0 1 0.448 1 1v16zM15.985 17.982h4.968c-0.936 1.152-1.689 2.325-2.265 3.705-0.575 1.381-0.638 2.818-0.749 4.312h2.131c0.009-0.666-0.195-1.385-0.051-2.156 0.146-0.771 0.352-1.532 0.617-2.285 0.267-0.752 0.598-1.461 0.996-2.127 0.396-0.667 0.853-1.229 1.367-1.686v-1.742h-7.015v1.979z"></path>
        </svg>  
        break;

      case 'percentage':
        return <svg version="1.1" className={classprop} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <title>Percentage</title>
          <path d="M18.293 4.293l-14 14c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0l14-14c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0zM10 6.5c0-0.966-0.393-1.843-1.025-2.475s-1.509-1.025-2.475-1.025-1.843 0.393-2.475 1.025-1.025 1.509-1.025 2.475 0.393 1.843 1.025 2.475 1.509 1.025 2.475 1.025 1.843-0.393 2.475-1.025 1.025-1.509 1.025-2.475zM8 6.5c0 0.414-0.167 0.788-0.439 1.061s-0.647 0.439-1.061 0.439-0.788-0.167-1.061-0.439-0.439-0.647-0.439-1.061 0.167-0.788 0.439-1.061 0.647-0.439 1.061-0.439 0.788 0.167 1.061 0.439 0.439 0.647 0.439 1.061zM21 17.5c0-0.966-0.393-1.843-1.025-2.475s-1.509-1.025-2.475-1.025-1.843 0.393-2.475 1.025-1.025 1.509-1.025 2.475 0.393 1.843 1.025 2.475 1.509 1.025 2.475 1.025 1.843-0.393 2.475-1.025 1.025-1.509 1.025-2.475zM19 17.5c0 0.414-0.167 0.788-0.439 1.061s-0.647 0.439-1.061 0.439-0.788-0.167-1.061-0.439-0.439-0.647-0.439-1.061 0.167-0.788 0.439-1.061 0.647-0.439 1.061-0.439 0.788 0.167 1.061 0.439 0.439 0.647 0.439 1.061z"></path>
        </svg>  
        break;

      case 'dollar':
        return <svg version="1.1" className={classprop} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <title>Dollar</title>
          <path d="M11 11h-1.5c-0.691 0-1.314-0.279-1.768-0.732s-0.732-1.077-0.732-1.768 0.279-1.314 0.732-1.768 1.077-0.732 1.768-0.732h1.5zM13 13h1.5c0.691 0 1.314 0.279 1.768 0.732s0.732 1.077 0.732 1.768-0.279 1.314-0.732 1.768-1.077 0.732-1.768 0.732h-1.5zM17 4h-4v-3c0-0.552-0.448-1-1-1s-1 0.448-1 1v3h-1.5c-1.242 0-2.369 0.505-3.182 1.318s-1.318 1.94-1.318 3.182 0.505 2.369 1.318 3.182 1.94 1.318 3.182 1.318h1.5v5h-5c-0.552 0-1 0.448-1 1s0.448 1 1 1h5v3c0 0.552 0.448 1 1 1s1-0.448 1-1v-3h1.5c1.242 0 2.369-0.505 3.182-1.318s1.318-1.94 1.318-3.182-0.505-2.369-1.318-3.182-1.94-1.318-3.182-1.318h-1.5v-5h4c0.552 0 1-0.448 1-1s-0.448-1-1-1z"></path>
        </svg>  
        break;

      case 'location':
        return <svg version="1.1" className={classprop} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 32">
          <title>Location</title>
          <path d="M17.070 2.93c-3.906-3.906-10.234-3.906-14.141 0-3.906 3.904-3.906 10.238 0 14.14 0.001 0 7.071 6.93 7.071 14.93 0-8 7.070-14.93 7.070-14.93 3.907-3.902 3.907-10.236 0-14.14zM10 14c-2.211 0-4-1.789-4-4s1.789-4 4-4 4 1.789 4 4-1.789 4-4 4z"></path>
        </svg>  
        break;

      case 'clipboard':
        return <svg version="1.1" className={classprop} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
          <title>Location</title>
          <path d="M24 32.041h-18c-1.105 0-2-0.893-2-1.996v-24.097c0-1.102 0.895-1.995 2-1.995h5v2.079h-4c-0.552 0-1 0.446-1 0.998v22.017c0 0.553 0.448 0.998 1 0.998h16c0.553 0 1-0.445 1-0.998v-22.017c0-0.552-0.447-0.998-1-0.998h-4v-2.079h5c1.104 0 2 0.894 2 1.995v24.097c0 1.103-0.896 1.996-2 1.996zM11 12.019h11v0.998h-11v-0.998zM11 15.013h11v0.998h-11v-0.998zM11 18.008h11v0.998h-11v-0.998zM11 21.002h11v0.998h-11v-0.998zM22 27.986h-11v-0.996h11v0.996zM11 23.996h11v0.998h-11v-0.998zM8 11.999h1v0.998h-1v-0.998zM8 14.993h1v0.998h-1v-0.998zM8 17.986h1v0.998h-1v-0.998zM8 20.98h1v0.998h-1v-0.998zM9 27.967h-1v-0.998h1v0.998zM8 23.975h1v0.998h-1v-0.998zM21 7.091c0.553 0 1 0.447 1 0.999s0 1.933 0 1.933h-14c0 0 0-1.382 0-1.933s0.447-0.999 1-0.999h3c0 0 0.012-1.419 0.012-3.041 0-1.684 1.3-3.092 2.988-3.092s3.033 1.48 3.033 3.102c0 1.747-0.033 3.031-0.033 3.031h3zM15 3.953c-0.553 0-1 0.446-1 0.997 0 0.552 0.447 0.998 1 0.998s1-0.446 1-0.998c0-0.551-0.447-0.997-1-0.997z"></path>
        </svg>  
        break;

      case 'arrow-left-large':
        return <svg version="1.1" className={classprop} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
          <title>Arrow Left Large</title>
          <path d="M1 16l15 15v-9h16v-12h-16v-9z"></path>
        </svg>  
        break;

      case 'drag':
        return <svg version="1.1" className={classprop} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
          <title>Drag Indicator</title>
          <path d="M15 15.984q0.797 0 1.406 0.609t0.609 1.406-0.609 1.406-1.406 0.609-1.406-0.609-0.609-1.406 0.609-1.406 1.406-0.609zM15 9.984q0.797 0 1.406 0.609t0.609 1.406-0.609 1.406-1.406 0.609-1.406-0.609-0.609-1.406 0.609-1.406 1.406-0.609zM15 8.016q-0.797 0-1.406-0.609t-0.609-1.406 0.609-1.406 1.406-0.609 1.406 0.609 0.609 1.406-0.609 1.406-1.406 0.609zM9 3.984q0.797 0 1.406 0.609t0.609 1.406-0.609 1.406-1.406 0.609-1.406-0.609-0.609-1.406 0.609-1.406 1.406-0.609zM9 9.984q0.797 0 1.406 0.609t0.609 1.406-0.609 1.406-1.406 0.609-1.406-0.609-0.609-1.406 0.609-1.406 1.406-0.609zM11.016 18q0 0.797-0.609 1.406t-1.406 0.609-1.406-0.609-0.609-1.406 0.609-1.406 1.406-0.609 1.406 0.609 0.609 1.406z"></path>
        </svg>  
        break;

      case 'adjust':
        return <svg version="1.1" className={classprop} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
          <title>Drag Indicator</title>
          <path d="M26 8v4h-4v4h-4v-4h-12v-4h12v-4h4v4h4zM14 16h-4v4h-4v4h4v4h4v-4h12v-4h-12v-4z"></path>
        </svg>  
        break;

      case 'print':
        return <svg version="1.1" className={classprop} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
          <title>Print</title>
          <path d="M8 2h16v4h-16v-4z"></path>
          <path d="M30 8h-28c-1.1 0-2 0.9-2 2v10c0 1.1 0.9 2 2 2h6v8h16v-8h6c1.1 0 2-0.9 2-2v-10c0-1.1-0.9-2-2-2zM4 14c-1.105 0-2-0.895-2-2s0.895-2 2-2 2 0.895 2 2-0.895 2-2 2zM22 28h-12v-10h12v10z"></path>
        </svg>  
        break;

      case 'thrash-can':
        return <svg version="1.1" className={classprop} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <title>Print</title>
          <path d="M18 7v13c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293h-10c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707v-13zM17 5v-1c0-0.828-0.337-1.58-0.879-2.121s-1.293-0.879-2.121-0.879h-4c-0.828 0-1.58 0.337-2.121 0.879s-0.879 1.293-0.879 2.121v1h-4c-0.552 0-1 0.448-1 1s0.448 1 1 1h1v13c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879h10c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121v-13h1c0.552 0 1-0.448 1-1s-0.448-1-1-1zM9 5v-1c0-0.276 0.111-0.525 0.293-0.707s0.431-0.293 0.707-0.293h4c0.276 0 0.525 0.111 0.707 0.293s0.293 0.431 0.293 0.707v1zM9 11v6c0 0.552 0.448 1 1 1s1-0.448 1-1v-6c0-0.552-0.448-1-1-1s-1 0.448-1 1zM13 11v6c0 0.552 0.448 1 1 1s1-0.448 1-1v-6c0-0.552-0.448-1-1-1s-1 0.448-1 1z"></path>
        </svg>  
        break;

      case 'send':
        return <svg version="1.1" className={classprop} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28">
          <title>Send</title>
          <path d="M27.563 0.172c0.328 0.234 0.484 0.609 0.422 1l-4 24c-0.047 0.297-0.234 0.547-0.5 0.703-0.141 0.078-0.313 0.125-0.484 0.125-0.125 0-0.25-0.031-0.375-0.078l-7.078-2.891-3.781 4.609c-0.187 0.234-0.469 0.359-0.766 0.359-0.109 0-0.234-0.016-0.344-0.063-0.391-0.141-0.656-0.516-0.656-0.938v-5.453l13.5-16.547-16.703 14.453-6.172-2.531c-0.359-0.141-0.594-0.469-0.625-0.859-0.016-0.375 0.172-0.734 0.5-0.922l26-15c0.156-0.094 0.328-0.141 0.5-0.141 0.203 0 0.406 0.063 0.562 0.172z"></path>
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
