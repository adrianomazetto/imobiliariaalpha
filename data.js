// DADOS DE EXEMPLO DE IMÓVEIS - ALPHA PRIME IMÓVEIS
const listingsData = [
    {
        id: 1,
        title: "Apartamento Luxo 3 Quartos - Vila Mariana",
        description: "Lindo apartamento com 3 quartos, 2 banheiros, sala ampla com varanda. Prédio com piscina, academia e salão de festas. Localização privilegiada.",
        price: 500000,
        propertyType: "Apartamento",
        transactionType: "Venda",
        location: "Av. Paulista, 1000",
        city: "São Paulo",
        state: "SP",
        bedrooms: 3,
        bathrooms: 2,
        area: 120,
        badge: "Ótimo Preço",
        agent: "João Silva",
        phone: "(11) 99999-1111",
        email: "joao@alphaprime.com",
        images: [
            "./img/img36.webp",
            "./img/img37.webp",
            "./img/img38.webp",
            "./img/img39.webp",
            "./img/img40.webp",
            "./img/img41.webp",
            "./img/img42.webp",
        ],
        features: ["Piscina", "Academia", "Salão de Festas", "Portaria 24h", "Garagem", "Ar Condicionado"]
    },
    {
        id: 2,
        title: "Casa Premium em Condomínio - Zona Sul",
        description: "Casa moderna com 4 quartos, 3 banheiros, cozinha integrada, pátio amplo. Condomínio com segurança 24h e áreas de lazer completas.",
        price: 800000,
        propertyType: "Casa",
        transactionType: "Venda",
        location: "Rua das Flores, 500",
        city: "São Paulo",
        state: "SP",
        bedrooms: 4,
        bathrooms: 3,
        area: 250,
        badge: "Retorno Garantido",
        agent: "Maria Santos",
        phone: "(11) 98888-2222",
        email: "maria@alphaprime.com",
        images: [
            "./img/img35.webp",
            "./img/img28.webp",
            "./img/img29.webp",
            "./img/img30.webp",
            "./img/img31.webp",
            "./img/img32.webp",
            "./img/img33.webp",
            "./img/img34.webp",
        ],
        features: ["Pátio Amplo", "Garagem Dupla", "Cozinha Integrada", "Segurança 24h", "Jardim"]
    },
    {
        id: 3,
        title: "Apartamento Executivo 2 Quartos - Centro",
        description: "Apartamento aconchegante no coração do centro. Próximo a metrô, comércios e serviços. Ideal para investimento ou moradia.",
        price: 350000,
        propertyType: "Apartamento",
        transactionType: "Venda",
        location: "Rua Augusta, 2000",
        city: "São Paulo",
        state: "SP",
        bedrooms: 2,
        bathrooms: 1,
        area: 85,
        badge: "Ótimo Preço",
        agent: "Pedro Costa",
        phone: "(11) 97777-3333",
        email: "pedro@alphaprime.com",
        images: [
            "./img/img2.webp",
            "./img/img1.webp",
            "./img/img3.webp",
            "./img/img4.webp",
            "./img/img5.webp",
            "./img/img6.webp",
        ],
        features: ["Próximo ao Metrô", "Comercial", "Bem Localizado", "Investimento"]
    },
    {
        id: 4,
        title: "Lote Comercial Premium - Zona Leste",
        description: "Excelente lote para comercialização. Localização privilegiada em zona de alto fluxo. Ideal para lojas, escritórios e empreendimentos.",
        price: 450000,
        propertyType: "Lote",
        transactionType: "Venda",
        location: "Av. Brasil, 5000",
        city: "São Paulo",
        state: "SP",
        bedrooms: 0,
        bathrooms: 0,
        area: 500,
        badge: null,
        agent: "Ana Oliveira",
        phone: "(11) 96666-4444",
        email: "ana@alphaprime.com",
        images: [
            "./img/lote.webp",
            "https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop"
        ],
        features: ["Zona Comercial", "Alto Fluxo", "Documentação OK"]
    },
    {
        id: 5,
        title: "Apartamento Moderno 1 Quarto - Aluguel",
        description: "Apartamento moderno para aluguel. Mobiliado, com ar condicionado e internet de alta velocidade. Perfeito para profissionais.",
        price: 2500,
        propertyType: "Apartamento",
        transactionType: "Aluguel",
        location: "Rua Oscar Freire, 1500",
        city: "São Paulo",
        state: "SP",
        bedrooms: 1,
        bathrooms: 1,
        area: 60,
        badge: null,
        agent: "Carlos Mendes",
        phone: "(11) 95555-5555",
        email: "carlos@alphaprime.com",
        images: [
            "./img/img47.webp",
            "./img/img44.webp",
            "./img/img45.webp",
            "./img/img46.webp",
            "./img/img43.webp"
        ],
        features: ["Mobiliado", "Ar Condicionado", "Internet", "Moderno"]
    },
    {
        id: 6,
        title: "Casa Aconchegante 2 Quartos - Aluguel",
        description: "Casa aconchegante para aluguel. Próxima a escolas e parques. Ideal para famílias que buscam segurança e conforto.",
        price: 3500,
        propertyType: "Casa",
        transactionType: "Aluguel",
        location: "Rua das Acácias, 800",
        city: "São Paulo",
        state: "SP",
        bedrooms: 2,
        bathrooms: 1,
        area: 150,
        badge: null,
        agent: "Fernanda Lima",
        phone: "(11) 94444-6666",
        email: "fernanda@alphaprime.com",
        images: [
            "./img/img20.webp",
            "./img/img19.webp",
            "./img/img21.webp",
            "./img/img22.webp",
            "./img/img23.webp",
            "./img/img24.webp"
        ],
        features: ["Próximo a Escolas", "Parque Próximo", "Seguro", "Familiar"]
    },
    {
        id: 7,
        title: "Espaço Comercial Premium 200m² - Centro",
        description: "Espaço comercial amplo no centro. Ideal para lojas, consultórios ou escritórios. Muito movimento e excelente visibilidade.",
        price: 600000,
        propertyType: "Comercial",
        transactionType: "Venda",
        location: "Rua XV de Novembro, 3000",
        city: "São Paulo",
        state: "SP",
        bedrooms: 0,
        bathrooms: 2,
        area: 200,
        badge: "Ótimo Preço",
        agent: "Roberto Alves",
        phone: "(11) 93333-7777",
        email: "roberto@alphaprime.com",
        images: [
            "./img/img14.webp",
            "./img/img15.webp",
            "./img/img16.webp",
            "./img/img17.webp",
            "./img/img18.webp"
        ],
        features: ["Centro", "Muito Movimento", "Amplo", "Bem Localizado"]
    },
    {
        id: 8,
        title: "Apartamento de Luxo com Vista - Ibirapuera",
        description: "Apartamento de luxo com vista para o parque. 4 suítes, home theater, piscina privativa. Acabamento premium e localização privilegiada.",
        price: 2500000,
        propertyType: "Apartamento",
        transactionType: "Venda",
        location: "Av. Ibirapuera, 2500",
        city: "São Paulo",
        state: "SP",
        bedrooms: 4,
        bathrooms: 4,
        area: 350,
        badge: "Retorno Garantido",
        agent: "Isabela Costa",
        phone: "(11) 92222-8888",
        email: "isabela@alphaprime.com",
        images: [
            "./img/img7.webp",
            "./img/img8.webp",
            "./img/img9.webp",
            "./img/img10.webp",
            "./img/img11.webp",
            "./img/img12.webp",
            "./img/img13.webp",            
        ],
        features: ["Luxo", "Vista Parque", "Home Theater", "Piscina Privativa", "Acabamento Premium"]
    }
];

// Função para formatar preço em Real
function formatPrice(price) {
    if (typeof price === 'string') {
        price = parseFloat(price);
    }
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(price);
}

// Função para formatar área
function formatArea(area) {
    return area + ' m²';
}
