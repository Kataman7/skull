src/  
│  
├── assets/  # Fichiers statiques  
│   ├── fonts/  
│   │   ├── roboto.ttf  
│   ├── images/  
│   │   ├── logo.png  
│   │   ├── banner.jpg  
│  
├── components/  # Composants UI (Atomic Design)  
│   ├── atoms/  
│   │   ├── Button.tsx  
│   │   ├── Input.tsx  
│   │   ├── Icon.tsx  
│   ├── molecules/  
│   │   ├── ProductCard.tsx  
│   │   ├── SearchBar.tsx  
│   ├── organisms/  
│   │   ├── ProductList.tsx  
│   │   ├── ShoppingCart.tsx  
│   ├── templates/  
│   │   ├── AuthLayout.tsx  
│   │   ├── DashboardLayout.tsx  
│  
├── lib/  # Logique métier et utilitaires  
│   ├── constants/  
│   │   ├── api.ts  
│   │   ├── categories.ts  
│   ├── helpers/  
│   │   ├── formatPrice.ts  
│   ├── hooks/  
│   │   ├── useCart.ts  
│   ├── store/  
│   │   ├── cartStore.ts  
│   ├── types/  
│   │   ├── Product.ts  
│  
├── pages/  # Pages principales  
│   ├── Home.tsx  
│   ├── ProductPage.tsx  
│   ├── Cart.tsx  
│   ├── Checkout.tsx  
│  
├── routes/  # Système de routage  
│   ├── routes.tsx  
│  
├── services/  # Gestion des requêtes API  
│   ├── products/  
│   │   ├── queries.ts  
│   │   ├── mutations.ts  
│   │   ├── api.ts  
│  
├── styles/  # Styles globaux  
│   ├── globals.css  
│  
├── index.tsx  # Point d’entrée React  
├── .env.local  # Variables d’environnement  
├── .gitignore  # Fichiers à ignorer par Git  
├── package.json  # Dépendances et scripts npm




Conventions de nommage par niveau
Niveau	Trigramme	Exemples
Atoms	Atm	AtmButton, AtmInput
Molecules	Mol	MolCounter, MolSearchBar
Organisms	Org	OrgNavbar, OrgThreeScene
Templates	Tmp	TmpDashboard, TmpArticle
Pages	Pag	PagHome, PagProfile