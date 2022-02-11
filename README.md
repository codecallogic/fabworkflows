<div id="top"></div>

<div align="center">
  <a href="https://github.com/codecallogic/fabworkflows">
    <img src="public/media/logo_2.png" alt="Logo">
  </a>

  <h3 align="center">Fabworkflow</h3>

  <p align="center">
    Countertop management software
    <br />
    <!-- <a href="https://github.com/codecallogic/fabworkflows"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/github_username/repo_name">View Demo</a>
    ·
    <a href="https://github.com/github_username/repo_name/issues">Report Bug</a>
    ·
    <a href="https://github.com/github_username/repo_name/issues">Request Feature</a> -->
  </p>
</div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#features">Features</a></li>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<br>

# About The Project

<img src="/public/media/readme/inventory_dashboard.png" alt="Logo" width="90%" height="500">

Fabworkflow is a management software for a countertop fabricator. Fabworkflow allows the business to create quotes, record and manage inventory, process purchases, and track warehouse jobs and activities. Fabworkflow aims to be a fully integrated warehouse management system including drawing professional countertop layouts.

<p align="right">(<a href="#top">back to top</a>)</p>

## Features

- QR code technology to track inventory
- Stripe integration to process orders
- Aggregate pipeline search
- Simple UI optimzed for productivity

<p align="right">(<a href="#top">back to top</a>)</p>

### Built with

- Next.js [Next.js](https://nextjs.org/)
- React.js [React.js](https://reactjs.org/)
- Sass [Sass](https://sass-lang.com/install)
- Redux [Redux](https://redux.js.org/)

![quote!](/public/media/readme/quote.png 'Quote')

<p align="right">(<a href="#top">back to top</a>)</p>

# Getting Started

To set up the project locally follow these steps. Please note that these steps are for the client side of the project. For server side guide and set up contact us. Server installation is required to run the software.

<p align="right">(<a href="#top">back to top</a>)</p>

## Prerequisites

Environment intallations required to use the softeware.

- npm

```sh
npm install npm@latest -g
```

<p align="right">(<a href="#top">back to top</a>)</p>

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/codecallogic/fabworkflows.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Enter your KEYS in `next.config.js`
   ```js
   GOOGLE = 'ENTER YOUR API';
   STRIPE = 'ENTER KEY';
   ```

<p align="right">(<a href="#top">back to top</a>)</p>

# Roadmap

- [x] Implement payment gateway
- [ ] Integrate a DFX drawing CAD system
  - [ ] Add documentation
- [ ] Develop client side design

<p align="right">(<a href="#top">back to top</a>)</p>

# Contact

Fabricio Guardia - contact@fabricioguardia.com
<br>
LinkedIn - <a href="https://www.linkedin.com/in/fabricio-guardia/">Visit</a>

# Acknowledgements

Helpful resources used in this project

- <a href="https://icomoon.io/">Icomoon</a>
- <a href="https://stripe.com/docs/payments/quickstart">Stripe</a>
- <a href="https://www.npmjs.com/package/react-places-autocomplete">React Places Autocomplete</a>
- <a href="https://lodash.com/">Lodash</a>
- <a href="https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en">Redux DevTools</a>
