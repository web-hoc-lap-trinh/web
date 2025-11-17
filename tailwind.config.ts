export default {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    100: '#49F4CC',
                    200: '#0DDB93',
                    300: '#44AD89',
                    400: '#528F79',
                    500: '#7DAF1A',
                },
                white: '#FFFFFF',
                secondary: {
                    100: '#F2F2F2',
                    200: '#B0B2B2',
                    300: '#3F3D56',
                    400: '#2F2E41',
                    500: '#292D32',
                    600: '#202526',
                    700: '#15221F',
                    800: '#16191A',
                },
                other: {
                    100: '#A0616A',
                    200: '#FF6536',
                    300: '#FF4848',
                    400: '#FF0B0B',
                }
            },
            fontFamily: {
                inter: ['Sprintural', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
