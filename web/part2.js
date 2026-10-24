<script>
(function(){
'use strict';

/* ---------- basics ---------- */
const $ = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const KEY = 'setlist.v1';
const APP_VERSION = '5.0', FEEDBACK_TO = 'ben@premierboating.com';
/* The web address of the app: the native app posts feedback there and links to it. */
const SITE_URL = window.BEARING_SITE_URL || 'https://bearing-beta.netlify.app';
/* Account service (Supabase project): the anon key is public by design; rows are protected per user on the server. */
const SYNC_URL = window.BEARING_SYNC_URL || '', SYNC_KEY = window.BEARING_SYNC_KEY || '';
/* Brand marks (Split B, round two): the signature wordmark and the symbol, outlined vectors, no fonts. */
const BRAND = {wordmark: '<svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" width="3211" height="575" viewBox="0 0 3210.74 574.58"><g transform="translate(80.000 487.580)"><path d="M302 -342 302 -344 301 -346 301 -348 300 -351 300 -353 299 -355 298 -357 297 -359 297 -361 296 -363 295 -365 294 -367 293 -369 291 -370 290 -372 289 -374 287 -376 286 -377 285 -379 283 -380 281 -382 280 -383 278 -385 276 -386 275 -388 273 -389 271 -390 269 -391 267 -392 265 -393 263 -394 261 -395 259 -396 257 -396 255 -397 253 -398 251 -398 249 -399 247 -399 245 -399 242 -400 240 -400 238 -400 236 -400 0 -400 0 -233 236 -233 238 -233 240 -233 242 -233 245 -233 247 -234 249 -234 251 -235 253 -235 255 -236 257 -236 259 -237 261 -238 263 -239 265 -240 267 -241 269 -242 271 -243 273 -244 275 -245 276 -247 278 -248 280 -249 281 -251 283 -252 285 -254 286 -256 287 -257 289 -259 290 -261 291 -262 293 -264 294 -266 295 -268 296 -270 297 -272 297 -274 298 -276 299 -278 300 -280 300 -282 301 -284 301 -286 302 -289 302 -291 302 -293 302 -295 303 -297 303 -299 303 -333 303 -336 302 -338 302 -340ZM220 -327 220 -326 221 -326 221 -299 220 -299 220 -298 220 -298 220 -297 220 -297 220 -296 220 -296 220 -296 220 -295 220 -295 220 -294 219 -294 219 -293 219 -293 219 -292 218 -292 218 -291 218 -291 218 -291 217 -290 217 -290 217 -289 216 -289 216 -289 216 -288 215 -288 215 -288 214 -287 214 -287 214 -287 213 -286 213 -286 212 -286 212 -286 211 -285 211 -285 211 -285 210 -285 210 -285 209 -285 209 -284 208 -284 208 -284 207 -284 207 -284 206 -284 206 -284 205 -284 97 -284 97 -341 205 -341 206 -341 206 -341 207 -341 207 -341 208 -341 208 -341 209 -341 209 -340 210 -340 210 -340 211 -340 211 -340 211 -340 212 -339 212 -339 213 -339 213 -339 214 -338 214 -338 214 -338 215 -338 215 -337 216 -337 216 -337 216 -336 217 -336 217 -335 217 -335 218 -335 218 -334 218 -334 218 -333 219 -333 219 -332 219 -332 219 -332 220 -331 220 -331 220 -330 220 -330 220 -329 220 -329 220 -328 220 -328 220 -327Z" fill="currentColor" fill-rule="evenodd"/><path d="M328 -136 327 -138 327 -141 326 -144 325 -146 325 -149 324 -152 323 -154 322 -157 321 -159 320 -161 319 -164 317 -166 316 -168 314 -171 313 -173 311 -175 310 -177 308 -179 306 -181 304 -183 302 -185 300 -187 298 -189 296 -190 294 -192 292 -193 289 -195 287 -196 285 -197 282 -199 280 -200 278 -201 275 -202 273 -203 270 -204 267 -204 265 -205 262 -206 260 -206 257 -206 254 -207 252 -207 249 -207 246 -207 246 -207 0 -207 0 0 246 0 249 0 252 0 254 0 257 -1 260 -1 262 -2 265 -2 267 -3 270 -4 273 -4 275 -5 278 -6 280 -7 282 -8 285 -10 287 -11 289 -12 292 -14 294 -15 296 -17 298 -19 300 -20 302 -22 304 -24 306 -26 308 -28 310 -30 311 -32 313 -34 314 -36 316 -39 317 -41 319 -43 320 -46 321 -48 322 -51 323 -53 324 -56 325 -58 325 -61 326 -63 327 -66 327 -69 328 -71 328 -74 328 -77 328 -79 328 -82 328 -125 328 -128 328 -130 328 -133ZM246 -142 246 -141 246 -141 246 -74 246 -74 246 -73 246 -73 246 -72 246 -72 246 -71 246 -71 246 -70 245 -70 245 -69 245 -69 245 -68 245 -68 245 -68 244 -67 244 -67 244 -66 244 -66 243 -65 243 -65 243 -65 242 -64 242 -64 242 -63 241 -63 241 -63 241 -62 240 -62 240 -62 239 -62 239 -61 238 -61 238 -61 238 -61 237 -60 237 -60 236 -60 236 -60 235 -60 235 -60 234 -59 234 -59 233 -59 233 -59 232 -59 232 -59 231 -59 231 -59 97 -59 97 -156 231 -156 231 -156 232 -156 232 -156 233 -156 233 -156 234 -156 234 -156 235 -155 235 -155 236 -155 236 -155 237 -155 237 -155 238 -154 238 -154 238 -154 239 -154 239 -153 240 -153 240 -153 241 -152 241 -152 241 -152 242 -151 242 -151 242 -151 243 -150 243 -150 243 -149 244 -149 244 -149 244 -148 244 -148 245 -147 245 -147 245 -146 245 -146 245 -145 245 -145 246 -144 246 -144 246 -144 246 -143 246 -143 246 -142Z" fill="#3F4A32" fill-rule="evenodd"/><path d="M771 -82 541 -82 541 -164 739 -164 739 -244 541 -244 541 -319 767 -319 767 -401 437 -401 437 0 771 0ZM1177 0 1289 0 1138 -401 1013 -401 862 0 970 0 994 -69 1153 -69ZM1049 -235 1049 -236 1049 -237 1050 -238 1050 -238 1050 -239 1051 -240 1051 -241 1051 -242 1052 -243 1052 -244 1052 -246 1053 -247 1053 -248 1053 -249 1054 -250 1054 -251 1054 -252 1055 -253 1055 -254 1055 -255 1056 -257 1056 -258 1056 -259 1057 -260 1057 -261 1058 -262 1058 -264 1058 -265 1059 -266 1059 -267 1059 -268 1060 -269 1060 -271 1060 -272 1061 -273 1061 -274 1062 -275 1062 -276 1062 -278 1063 -279 1063 -280 1063 -281 1064 -282 1064 -283 1064 -285 1065 -286 1065 -287 1066 -288 1066 -289 1066 -290 1066 -291 1067 -292 1067 -294 1067 -295 1068 -296 1068 -297 1068 -298 1069 -299 1069 -300 1069 -301 1069 -302 1070 -303 1070 -304 1070 -305 1070 -306 1071 -307 1071 -308 1071 -309 1071 -310 1075 -310 1075 -309 1076 -308 1076 -308 1076 -307 1076 -306 1077 -305 1077 -305 1077 -304 1077 -303 1078 -302 1078 -302 1078 -301 1078 -300 1079 -299 1079 -298 1079 -297 1079 -297 1080 -296 1080 -295 1080 -294 1080 -293 1081 -292 1081 -291 1081 -290 1081 -289 1082 -289 1082 -288 1082 -287 1082 -286 1083 -285 1083 -284 1083 -283 1083 -282 1084 -281 1084 -280 1084 -279 1084 -278 1085 -278 1085 -277 1085 -276 1085 -275 1086 -274 1086 -273 1086 -272 1086 -271 1087 -270 1087 -269 1087 -269 1087 -268 1088 -267 1088 -266 1088 -265 1089 -264 1089 -263 1089 -262 1089 -261 1090 -261 1090 -260 1090 -259 1090 -258 1091 -257 1091 -256 1091 -255 1091 -255 1092 -254 1092 -253 1092 -252 1093 -251 1093 -251 1093 -250 1093 -249 1094 -248 1094 -247 1094 -247 1094 -246 1095 -245 1095 -244 1095 -243 1095 -243 1096 -242 1096 -241 1096 -241 1096 -240 1097 -239 1097 -239 1097 -238 1097 -237 1097 -237 1098 -236 1098 -235 1098 -235 1098 -234 1099 -234 1099 -233 1099 -233 1099 -232 1128 -148 1019 -148 1048 -232 1048 -233 1048 -234ZM1657 0 1774 0 1693 -159 1696 -160 1699 -162 1701 -163 1704 -165 1706 -166 1708 -168 1711 -170 1713 -171 1715 -173 1718 -175 1720 -177 1722 -179 1724 -181 1726 -183 1728 -185 1730 -187 1732 -189 1733 -191 1735 -194 1737 -196 1738 -198 1740 -201 1742 -203 1743 -206 1745 -208 1746 -211 1747 -213 1749 -216 1750 -218 1751 -221 1752 -224 1753 -226 1754 -229 1755 -232 1756 -235 1756 -238 1757 -241 1758 -243 1758 -246 1759 -249 1759 -252 1760 -255 1760 -258 1760 -261 1761 -265 1761 -268 1761 -271 1761 -274 1761 -277 1761 -280 1761 -283 1761 -286 1760 -289 1760 -291 1760 -294 1759 -297 1759 -300 1758 -303 1758 -305 1757 -308 1757 -311 1756 -313 1755 -316 1754 -318 1753 -321 1753 -324 1752 -326 1751 -329 1750 -331 1748 -334 1747 -336 1746 -338 1745 -341 1744 -343 1742 -346 1741 -348 1739 -350 1738 -352 1736 -354 1735 -356 1733 -358 1731 -360 1729 -362 1727 -364 1726 -366 1724 -368 1722 -370 1720 -372 1718 -373 1715 -375 1713 -377 1711 -378 1709 -380 1706 -381 1704 -383 1701 -384 1699 -385 1696 -387 1694 -388 1691 -389 1688 -390 1686 -391 1683 -392 1680 -393 1677 -394 1674 -395 1671 -396 1668 -396 1665 -397 1662 -398 1659 -398 1655 -399 1652 -399 1649 -400 1645 -400 1642 -400 1638 -400 1635 -400 1631 -401 1627 -401 1395 -401 1395 0 1499 0 1499 -141 1591 -141ZM1610 -321 1611 -321 1612 -321 1613 -321 1614 -321 1615 -321 1617 -321 1618 -320 1619 -320 1620 -320 1621 -320 1622 -319 1623 -319 1624 -319 1625 -319 1626 -318 1627 -318 1628 -317 1629 -317 1630 -317 1631 -316 1632 -316 1633 -315 1634 -315 1634 -314 1635 -314 1636 -313 1637 -312 1638 -312 1638 -311 1639 -311 1640 -310 1641 -309 1641 -309 1642 -308 1643 -307 1643 -306 1644 -306 1645 -305 1645 -304 1646 -303 1646 -302 1647 -302 1647 -301 1648 -300 1648 -299 1649 -298 1649 -297 1650 -296 1650 -295 1651 -294 1651 -293 1652 -292 1652 -291 1652 -290 1653 -289 1653 -288 1653 -287 1653 -286 1654 -285 1654 -283 1654 -282 1654 -281 1654 -280 1654 -279 1655 -277 1655 -276 1655 -275 1655 -274 1655 -272 1655 -271 1655 -269 1655 -267 1655 -265 1654 -263 1654 -262 1654 -260 1654 -258 1653 -256 1653 -255 1653 -253 1652 -251 1652 -250 1651 -248 1650 -247 1650 -245 1649 -244 1648 -242 1647 -241 1647 -239 1646 -238 1645 -237 1644 -235 1643 -234 1642 -233 1641 -232 1639 -231 1638 -230 1637 -229 1636 -228 1635 -227 1633 -226 1632 -225 1631 -224 1629 -224 1628 -223 1626 -222 1625 -222 1624 -221 1622 -221 1620 -220 1619 -220 1617 -220 1616 -219 1614 -219 1612 -219 1611 -219 1609 -219 1607 -219 1499 -219 1499 -321 1607 -321 1608 -321ZM1995 -401 1890 -401 1890 0 1995 0ZM2237 -196 2237 -197 2237 -198 2237 -198 2237 -199 2237 -199 2237 -200 2237 -201 2237 -201 2237 -202 2237 -202 2237 -203 2237 -204 2237 -204 2237 -205 2237 -206 2237 -207 2237 -207 2237 -208 2237 -209 2237 -210 2237 -210 2237 -211 2237 -212 2237 -213 2237 -214 2237 -214 2237 -215 2237 -216 2237 -217 2237 -218 2237 -218 2237 -219 2237 -220 2237 -221 2237 -222 2237 -222 2237 -223 2237 -224 2237 -225 2237 -225 2237 -226 2237 -227 2237 -228 2237 -229 2237 -229 2237 -230 2237 -231 2240 -231 2241 -231 2241 -230 2241 -230 2242 -229 2242 -229 2242 -228 2243 -227 2243 -227 2244 -226 2244 -226 2245 -225 2245 -224 2245 -224 2246 -223 2246 -222 2247 -221 2247 -221 2248 -220 2248 -219 2249 -218 2249 -218 2250 -217 2250 -216 2251 -215 2252 -214 2252 -214 2253 -213 2253 -212 2254 -211 2254 -210 2255 -209 2256 -209 2256 -208 2257 -207 2257 -206 2258 -205 2259 -205 2259 -204 2260 -203 2260 -202 2261 -201 2262 -201 2262 -200 2263 -199 2263 -198 2264 -197 2265 -197 2265 -196 2420 0 2512 0 2512 -401 2415 -401 2415 -215 2415 -214 2415 -213 2415 -212 2415 -212 2415 -211 2415 -210 2415 -209 2415 -209 2415 -208 2415 -207 2415 -206 2415 -205 2415 -205 2415 -204 2415 -203 2415 -202 2415 -201 2415 -200 2415 -199 2415 -198 2415 -197 2415 -196 2415 -195 2415 -194 2415 -193 2415 -192 2415 -191 2415 -190 2415 -189 2415 -188 2415 -187 2415 -186 2415 -185 2415 -184 2415 -183 2415 -182 2415 -181 2415 -180 2415 -179 2415 -178 2415 -177 2415 -176 2415 -175 2415 -174 2415 -173 2415 -172 2415 -171 2415 -170 2412 -169 2412 -170 2412 -170 2411 -170 2411 -171 2411 -171 2411 -172 2410 -172 2410 -173 2410 -174 2409 -174 2409 -175 2408 -175 2408 -176 2408 -177 2407 -177 2407 -178 2406 -178 2406 -179 2405 -180 2405 -180 2404 -181 2404 -182 2403 -183 2403 -183 2402 -184 2402 -185 2401 -186 2401 -186 2400 -187 2400 -188 2399 -189 2399 -189 2398 -190 2398 -191 2397 -192 2396 -192 2396 -193 2395 -194 2395 -195 2394 -195 2394 -196 2393 -197 2393 -198 2392 -198 2391 -199 2391 -200 2390 -200 2390 -201 2389 -202 2389 -203 2388 -203 2388 -204 2387 -205 2387 -205 2386 -206 2386 -207 2385 -207 2385 -208 2384 -208 2384 -209 2383 -209 2383 -210 2382 -210 2382 -211 2382 -212 2381 -212 2381 -212 2380 -213 2380 -213 2380 -214 2379 -214 2379 -215 2233 -401 2141 -401 2141 0 2237 0 2237 -196ZM2848 7 2850 7 2853 7 2855 7 2858 7 2860 6 2863 6 2865 6 2867 6 2870 6 2872 5 2874 5 2876 5 2879 5 2881 4 2883 4 2885 4 2888 3 2890 3 2892 3 2894 2 2896 2 2898 1 2900 1 2902 0 2904 0 2906 -1 2908 -1 2910 -2 2912 -2 2914 -3 2916 -4 2918 -4 2920 -5 2922 -6 2923 -6 2925 -7 2927 -8 2929 -9 2931 -9 2933 -10 2934 -11 2936 -12 2938 -13 2940 -14 2941 -15 2943 -16 2945 -16 2947 -17 2948 -18 2950 -19 2952 -20 2953 -21 2955 -23 2957 -24 2958 -25 2960 -26 2961 -27 2963 -28 2965 -29 2966 -30 2968 -32 2969 -33 2971 -34 2973 -35 2974 -37 2976 -38 2977 -39 2979 -41 2980 -42 2990 0 3051 0 3051 -220 2841 -220 2841 -146 2949 -146 2949 -143 2949 -142 2949 -140 2949 -138 2949 -136 2949 -135 2948 -133 2948 -131 2948 -130 2948 -128 2947 -127 2947 -125 2946 -123 2946 -122 2945 -120 2944 -119 2944 -117 2943 -116 2942 -115 2941 -113 2941 -112 2940 -110 2939 -109 2938 -108 2937 -106 2936 -105 2935 -104 2933 -103 2932 -101 2931 -100 2930 -99 2929 -98 2927 -97 2926 -96 2925 -95 2923 -94 2922 -93 2921 -92 2919 -91 2918 -90 2916 -89 2915 -88 2913 -87 2911 -87 2910 -86 2908 -85 2906 -84 2905 -83 2903 -83 2901 -82 2899 -81 2898 -81 2896 -80 2894 -80 2892 -79 2890 -79 2888 -78 2886 -78 2884 -77 2882 -77 2880 -77 2878 -76 2876 -76 2874 -76 2872 -76 2870 -75 2868 -75 2866 -75 2864 -75 2861 -75 2859 -75 2857 -75 2855 -75 2852 -75 2849 -75 2846 -75 2844 -75 2841 -75 2838 -75 2836 -76 2833 -76 2831 -76 2828 -77 2826 -77 2823 -78 2821 -78 2818 -79 2816 -80 2814 -80 2812 -81 2809 -82 2807 -82 2805 -83 2803 -84 2801 -85 2799 -86 2797 -87 2795 -88 2793 -89 2791 -90 2789 -92 2787 -93 2786 -94 2784 -96 2782 -97 2781 -98 2779 -100 2778 -101 2776 -103 2775 -104 2773 -106 2772 -108 2771 -109 2769 -111 2768 -113 2767 -115 2766 -117 2765 -119 2764 -121 2763 -123 2762 -125 2761 -127 2760 -129 2759 -131 2758 -133 2757 -136 2756 -138 2756 -140 2755 -143 2754 -145 2754 -148 2753 -150 2753 -153 2752 -156 2752 -158 2752 -161 2751 -164 2751 -166 2751 -169 2750 -172 2750 -175 2750 -178 2750 -181 2750 -184 2750 -187 2750 -213 2750 -215 2750 -217 2750 -220 2750 -222 2750 -224 2750 -226 2750 -229 2751 -231 2751 -233 2751 -235 2751 -237 2752 -239 2752 -241 2752 -243 2752 -245 2753 -247 2753 -249 2754 -251 2754 -253 2755 -255 2755 -256 2756 -258 2756 -260 2757 -262 2757 -264 2758 -265 2758 -267 2759 -269 2760 -270 2760 -272 2761 -274 2762 -275 2763 -277 2763 -278 2764 -280 2765 -281 2766 -283 2767 -284 2768 -286 2768 -287 2769 -288 2770 -290 2771 -291 2772 -292 2773 -294 2774 -295 2776 -296 2777 -297 2778 -299 2779 -300 2780 -301 2781 -302 2783 -303 2784 -304 2785 -305 2786 -306 2788 -307 2789 -308 2791 -309 2792 -310 2793 -311 2795 -312 2796 -313 2798 -313 2799 -314 2801 -315 2802 -316 2804 -316 2806 -317 2807 -318 2809 -318 2811 -319 2813 -320 2814 -320 2816 -321 2818 -321 2820 -322 2822 -322 2823 -322 2825 -323 2827 -323 2829 -324 2831 -324 2833 -324 2835 -324 2837 -325 2839 -325 2841 -325 2843 -325 2845 -326 2847 -326 2850 -326 2852 -326 2854 -326 2856 -326 2858 -326 2860 -326 2861 -326 2863 -326 2864 -326 2866 -326 2867 -326 2869 -326 2870 -325 2872 -325 2873 -325 2875 -325 2876 -325 2877 -325 2879 -324 2880 -324 2882 -324 2883 -324 2884 -323 2886 -323 2887 -323 2889 -323 2890 -322 2891 -322 2893 -322 2894 -321 2895 -321 2897 -320 2898 -320 2899 -320 2901 -319 2902 -319 2903 -318 2904 -318 2906 -317 2907 -317 2908 -316 2909 -316 2910 -315 2912 -315 2913 -314 2914 -313 2915 -313 2916 -312 2917 -311 2918 -311 2919 -310 2921 -309 2922 -309 2923 -308 2924 -307 2925 -307 2926 -306 2927 -305 2928 -304 2928 -303 2929 -303 2930 -302 2931 -301 2932 -300 2933 -299 2934 -298 2934 -297 2935 -297 2936 -296 2937 -295 2937 -294 2938 -293 2939 -292 2939 -291 2940 -290 2941 -289 2941 -288 2942 -287 2942 -286 2943 -285 2943 -283 2944 -282 2944 -281 2945 -280 2945 -279 2945 -278 2946 -277 2946 -276 2946 -274 2947 -273 2947 -272 2947 -271 2947 -270 2948 -268 2948 -267 2948 -266 2948 -265 2948 -263 2948 -262 2948 -261 2948 -259 3051 -259 3051 -263 3051 -266 3050 -269 3050 -272 3050 -275 3050 -278 3049 -280 3049 -283 3049 -286 3048 -289 3048 -292 3047 -294 3046 -297 3046 -300 3045 -302 3044 -305 3043 -308 3042 -310 3041 -313 3040 -315 3039 -317 3038 -320 3037 -322 3036 -324 3034 -327 3033 -329 3032 -331 3030 -333 3029 -336 3027 -338 3026 -340 3024 -342 3022 -344 3021 -346 3019 -348 3017 -350 3016 -352 3014 -354 3012 -355 3010 -357 3008 -359 3006 -361 3004 -362 3002 -364 3000 -366 2998 -367 2995 -369 2993 -371 2991 -372 2988 -374 2986 -375 2984 -376 2981 -378 2979 -379 2976 -380 2974 -382 2971 -383 2969 -384 2966 -385 2964 -387 2961 -388 2958 -389 2956 -390 2953 -391 2950 -392 2947 -393 2945 -394 2942 -395 2939 -396 2936 -397 2933 -397 2930 -398 2927 -399 2924 -400 2921 -400 2918 -401 2915 -402 2912 -402 2909 -403 2906 -403 2903 -404 2900 -404 2896 -405 2893 -405 2890 -406 2887 -406 2884 -406 2881 -407 2877 -407 2874 -407 2871 -407 2868 -407 2864 -407 2861 -408 2858 -408 2854 -408 2849 -408 2843 -407 2838 -407 2832 -407 2827 -407 2822 -406 2817 -406 2812 -405 2807 -404 2802 -404 2797 -403 2792 -402 2787 -401 2783 -400 2778 -399 2774 -397 2769 -396 2765 -395 2760 -393 2756 -392 2752 -390 2748 -388 2744 -386 2740 -385 2736 -383 2732 -381 2728 -378 2724 -376 2721 -374 2717 -372 2714 -369 2711 -367 2707 -364 2704 -361 2701 -359 2698 -356 2695 -353 2692 -350 2689 -347 2686 -344 2684 -341 2681 -337 2679 -334 2676 -330 2674 -327 2672 -323 2669 -320 2667 -316 2665 -312 2663 -308 2662 -304 2660 -300 2658 -296 2657 -291 2655 -287 2654 -283 2652 -278 2651 -274 2650 -269 2649 -264 2648 -259 2647 -254 2646 -249 2645 -244 2645 -239 2644 -234 2644 -228 2643 -223 2643 -218 2643 -212 2643 -206 2643 -201 2643 -192 2643 -183 2643 -175 2644 -167 2645 -159 2646 -151 2647 -144 2648 -137 2650 -129 2651 -122 2653 -116 2655 -109 2657 -103 2660 -96 2662 -90 2665 -84 2668 -79 2671 -73 2674 -68 2678 -63 2681 -58 2685 -53 2689 -49 2693 -44 2697 -40 2702 -36 2706 -32 2711 -29 2716 -25 2721 -22 2726 -19 2732 -16 2737 -13 2743 -10 2749 -8 2755 -6 2761 -4 2768 -2 2774 0 2781 1 2788 3 2795 4 2802 5 2809 6 2817 6 2824 7 2832 7 2840 7 2843 7 2845 7Z" fill="currentColor" fill-rule="evenodd"/></g></svg>', symbol: '<svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" width="656" height="800" viewBox="172 100 656 800"><g transform="translate(-2.564 -125.641) scale(10.25641)"><path d="M80.9 73.5 80.8 73 80.7 72.5 80.6 72 80.5 71.5 80.3 71 80.2 70.5 80 70 79.8 69.5 79.6 69 79.3 68.5 79.1 68.1 78.9 67.6 78.6 67.2 78.3 66.7 78 66.3 77.7 65.9 77.4 65.5 77 65 76.7 64.7 76.3 64.3 75.9 63.9 75.5 63.6 75.2 63.2 74.7 62.9 74.3 62.6 73.9 62.3 73.5 62 73 61.7 72.5 61.5 72.1 61.2 71.6 61 71.1 60.8 70.6 60.6 70.1 60.5 69.6 60.3 69.1 60.1 68.6 60 68.1 59.9 67.6 59.8 67.1 59.7 66.6 59.7 66 59.6 65.5 59.6 65 59.6 65 59.6 17 59.6 17 100 65 100 65.5 100 66 100 66.6 99.9 67.1 99.9 67.6 99.8 68.1 99.7 68.6 99.6 69.1 99.5 69.6 99.3 70.1 99.2 70.6 99 71.1 98.8 71.6 98.6 72.1 98.3 72.5 98.1 73 97.9 73.5 97.6 73.9 97.3 74.3 97 74.7 96.7 75.2 96.4 75.5 96 75.9 95.7 76.3 95.3 76.7 94.9 77 94.5 77.4 94.2 77.7 93.7 78 93.3 78.3 92.9 78.6 92.5 78.9 92 79.1 91.5 79.3 91.1 79.6 90.6 79.8 90.1 80 89.6 80.2 89.1 80.3 88.6 80.5 88.1 80.6 87.6 80.7 87.1 80.8 86.6 80.9 86.1 80.9 85.6 81 85 81 84.5 81 84 81 75.6 81 75.1 81 74.5 80.9 74ZM65 72.4 65 72.5 65 72.6 65 85.5 65 85.6 65 85.7 65 85.8 65 85.9 65 86 64.9 86.1 64.9 86.2 64.9 86.3 64.9 86.4 64.8 86.5 64.8 86.6 64.8 86.7 64.7 86.7 64.7 86.8 64.7 86.9 64.6 87 64.5 87.1 64.5 87.2 64.4 87.2 64.4 87.3 64.3 87.4 64.3 87.5 64.2 87.5 64.1 87.6 64 87.7 64 87.8 63.9 87.8 63.8 87.9 63.8 87.9 63.7 88 63.6 88 63.5 88.1 63.4 88.2 63.3 88.2 63.2 88.2 63.1 88.3 63.1 88.3 63 88.3 62.9 88.4 62.8 88.4 62.7 88.4 62.6 88.4 62.5 88.5 62.4 88.5 62.3 88.5 62.2 88.5 62.1 88.5 62 88.5 36 88.5 36 69.6 62 69.6 62.1 69.6 62.2 69.6 62.3 69.6 62.4 69.6 62.5 69.6 62.6 69.7 62.7 69.7 62.8 69.7 62.9 69.7 63 69.8 63.1 69.8 63.1 69.8 63.2 69.9 63.3 69.9 63.4 70 63.5 70 63.6 70 63.7 70.1 63.8 70.2 63.8 70.2 63.9 70.3 64 70.3 64 70.4 64.1 70.5 64.2 70.5 64.3 70.6 64.3 70.7 64.4 70.8 64.4 70.8 64.5 70.9 64.5 71 64.6 71.1 64.7 71.2 64.7 71.3 64.7 71.4 64.8 71.5 64.8 71.5 64.8 71.6 64.9 71.7 64.9 71.8 64.9 71.9 64.9 72 65 72.1 65 72.2 65 72.3Z" fill="#3F4A32" fill-rule="evenodd"/><path d="M75.9 33.3 75.8 32.9 75.8 32.5 75.7 32 75.6 31.6 75.4 31.2 75.3 30.8 75.2 30.4 75 30 74.8 29.6 74.7 29.2 74.5 28.9 74.3 28.5 74 28.1 73.8 27.8 73.6 27.4 73.3 27.1 73 26.8 72.8 26.4 72.5 26.1 72.2 25.8 71.9 25.5 71.6 25.2 71.2 24.9 70.9 24.7 70.6 24.4 70.2 24.2 69.9 24 69.5 23.7 69.1 23.5 68.8 23.3 68.4 23.2 68 23 67.6 22.8 67.2 22.7 66.8 22.6 66.4 22.4 66 22.3 65.5 22.2 65.1 22.2 64.7 22.1 64.3 22.1 63.9 22 63.4 22 63 22 17 22 17 54.6 63 54.6 63.4 54.6 63.9 54.6 64.3 54.5 64.7 54.5 65.1 54.4 65.5 54.4 66 54.3 66.4 54.2 66.8 54 67.2 53.9 67.6 53.8 68 53.6 68.4 53.4 68.8 53.3 69.1 53.1 69.5 52.9 69.9 52.6 70.2 52.4 70.6 52.2 70.9 51.9 71.2 51.6 71.6 51.4 71.9 51.1 72.2 50.8 72.5 50.5 72.8 50.2 73 49.9 73.3 49.5 73.6 49.2 73.8 48.8 74 48.5 74.3 48.1 74.5 47.7 74.7 47.4 74.8 47 75 46.6 75.2 46.2 75.3 45.8 75.4 45.4 75.6 45 75.7 44.5 75.8 44.1 75.8 43.7 75.9 43.3 75.9 42.9 76 42.5 76 42 76 41.6 76 35 76 34.6 76 34.1 75.9 33.7ZM60 36.3 60 36.4 60 36.5 60 41.6 60 41.7 60 41.8 60 41.9 60 42 60 42.1 59.9 42.2 59.9 42.3 59.9 42.4 59.9 42.5 59.8 42.6 59.8 42.7 59.8 42.8 59.7 42.8 59.7 42.9 59.6 43 59.6 43.1 59.5 43.2 59.5 43.3 59.4 43.4 59.4 43.4 59.3 43.5 59.3 43.6 59.2 43.6 59.1 43.7 59 43.8 59 43.9 58.9 43.9 58.8 44 58.8 44 58.7 44.1 58.6 44.1 58.5 44.2 58.4 44.2 58.3 44.3 58.2 44.3 58.1 44.4 58.1 44.4 58 44.4 57.9 44.5 57.8 44.5 57.7 44.5 57.6 44.5 57.5 44.6 57.4 44.6 57.3 44.6 57.2 44.6 57.1 44.6 57 44.6 36 44.6 36 33.5 57 33.5 57.1 33.5 57.2 33.5 57.3 33.5 57.4 33.5 57.5 33.5 57.6 33.6 57.7 33.6 57.8 33.6 57.9 33.6 58 33.7 58.1 33.7 58.1 33.7 58.2 33.8 58.3 33.8 58.4 33.9 58.5 33.9 58.6 34 58.7 34 58.8 34.1 58.8 34.1 58.9 34.2 59 34.2 59 34.3 59.1 34.4 59.2 34.5 59.3 34.5 59.3 34.6 59.4 34.7 59.4 34.8 59.5 34.8 59.5 34.9 59.6 35 59.6 35.1 59.7 35.2 59.7 35.3 59.8 35.4 59.8 35.4 59.8 35.5 59.9 35.6 59.9 35.7 59.9 35.8 59.9 35.9 60 36 60 36.1 60 36.2Z" fill="currentColor" fill-rule="evenodd"/></g></svg>'};
const FB_TYPES = [['feature', 'A feature I want'], ['improve', 'Something to improve'], ['bug', 'Something broken'], ['other', 'Other']];
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const DAYS_LONG = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pad = n => String(n).padStart(2, '0');
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

/* ---------- dates (local, keyed YYYY-MM-DD, weeks start Monday) ---------- */
const keyOf = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
const dateOf = k => { const p = k.split('-').map(Number); return new Date(p[0], p[1] - 1, p[2], 12); };
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const todayKey = () => keyOf(new Date());
const weekStart = k => { const d = dateOf(k); return keyOf(addDays(d, -((d.getDay() + 6) % 7))); };
const weekKeys = ws => Array.from({length: 7}, (_, i) => keyOf(addDays(dateOf(ws), i)));
const fmtShort = k => { const d = dateOf(k); return MONTHS[d.getMonth()] + ' ' + d.getDate(); };
const fmtLong = k => { const d = dateOf(k); return DAYS_LONG[d.getDay()] + ', ' + MONTHS[d.getMonth()] + ' ' + d.getDate(); };
const fmtWeekday = k => { const d = dateOf(k); return DAYS[d.getDay()] + ' ' + MONTHS[d.getMonth()] + ' ' + d.getDate(); };
const relDay = k => { if (k === todayKey()) return 'Today'; if (k === keyOf(addDays(new Date(), -1))) return 'Yesterday'; return fmtLong(k); };
const fmtTime = ms => { const d = new Date(ms); let h = d.getHours(); const ap = h >= 12 ? 'pm' : 'am'; h = h % 12 || 12; return h + ':' + pad(d.getMinutes()) + ' ' + ap; };
const mmss = s => { s = Math.max(0, Math.round(s)); return Math.floor(s / 60) + ':' + pad(s % 60); };
const hms = s => { s = Math.max(0, Math.round(s)); const h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60); return h ? h + ':' + pad(m) + ':' + pad(s % 60) : m + ':' + pad(s % 60); };
const durLabel = s => { const m = Math.round(s / 60); return m >= 60 ? Math.floor(m / 60) + 'h ' + (m % 60) + 'm' : m + ' min'; };

/* ---------- exercise catalog ---------- */
const CATALOG = [
  // Chest
  {id:'bench', name:'Barbell Bench Press', type:'lift', group:'Chest', eq:'barbell', bar:true},
  {id:'incbench', name:'Incline Barbell Bench Press', type:'lift', group:'Chest', eq:'barbell', bar:true},
  {id:'decbench', name:'Decline Barbell Bench Press', type:'lift', group:'Chest', eq:'barbell', bar:true},
  {id:'cgbench', name:'Close-Grip Bench Press', type:'lift', group:'Chest', eq:'barbell', bar:true},
  {id:'floorpress', name:'Floor Press', type:'lift', group:'Chest', eq:'barbell', bar:true},
  {id:'smithbench', name:'Smith Machine Bench Press', type:'lift', group:'Chest', eq:'smith'},
  {id:'dbbench', name:'Dumbbell Bench Press', type:'lift', group:'Chest', eq:'dumbbell'},
  {id:'incdb', name:'Incline Dumbbell Press', type:'lift', group:'Chest', eq:'dumbbell'},
  {id:'decdb', name:'Decline Dumbbell Press', type:'lift', group:'Chest', eq:'dumbbell'},
  {id:'dbfly', name:'Dumbbell Fly', type:'lift', group:'Chest', eq:'dumbbell'},
  {id:'incdbfly', name:'Incline Dumbbell Fly', type:'lift', group:'Chest', eq:'dumbbell'},
  {id:'pullover', name:'Dumbbell Pullover', type:'lift', group:'Chest', eq:'dumbbell'},
  {id:'chestpress', name:'Machine Chest Press', type:'lift', group:'Chest', eq:'machine'},
  {id:'incchestpress', name:'Incline Machine Press', type:'lift', group:'Chest', eq:'machine'},
  {id:'pecdeck', name:'Pec Deck', type:'lift', group:'Chest', eq:'machine'},
  {id:'cablefly', name:'Cable Fly', type:'lift', group:'Chest', eq:'cable', k:"crossover"},
  {id:'cableflylow', name:'Low-to-High Cable Fly', type:'lift', group:'Chest', eq:'cable'},
  {id:'cableflyhigh', name:'High-to-Low Cable Fly', type:'lift', group:'Chest', eq:'cable'},
  {id:'pushup', name:'Push-up', type:'lift', group:'Chest', eq:'bodyweight', bw:true, k:"weighted plate vest"},
  {id:'declinepushup', name:'Decline Push-up', type:'lift', group:'Chest', eq:'bodyweight', bw:true},
  {id:'dip', name:'Dip', type:'lift', group:'Chest', eq:'bodyweight', bw:true, k:"weighted belt"},
  // Shoulders
  {id:'ohp', name:'Overhead Press', type:'lift', group:'Shoulders', eq:'barbell', bar:true},
  {id:'pushpress', name:'Push Press', type:'lift', group:'Shoulders', eq:'barbell', bar:true},
  {id:'seatedohp', name:'Seated Barbell Press', type:'lift', group:'Shoulders', eq:'barbell', bar:true},
  {id:'landmine', name:'Landmine Press', type:'lift', group:'Shoulders', eq:'landmine', k:"press single arm"},
  {id:'dbohp', name:'Dumbbell Shoulder Press', type:'lift', group:'Shoulders', eq:'dumbbell'},
  {id:'arnold', name:'Arnold Press', type:'lift', group:'Shoulders', eq:'dumbbell'},
  {id:'machohp', name:'Machine Shoulder Press', type:'lift', group:'Shoulders', eq:'machine'},
  {id:'latraise', name:'Lateral Raise', type:'lift', group:'Shoulders', eq:'dumbbell'},
  {id:'cablelat', name:'Cable Lateral Raise', type:'lift', group:'Shoulders', eq:'cable'},
  {id:'machlat', name:'Machine Lateral Raise', type:'lift', group:'Shoulders', eq:'machine'},
  {id:'frontraise', name:'Front Raise', type:'lift', group:'Shoulders', eq:'dumbbell'},
  {id:'reardelt', name:'Rear Delt Fly', type:'lift', group:'Shoulders', eq:'dumbbell'},
  {id:'revpecdeck', name:'Reverse Pec Deck', type:'lift', group:'Shoulders', eq:'machine', k:"rear delt fly machine reverse fly"},
  {id:'facepull', name:'Face Pull', type:'lift', group:'Shoulders', eq:'cable'},
  {id:'uprightrow', name:'Upright Row', type:'lift', group:'Shoulders', eq:'barbell', bar:true},
  {id:'shrug', name:'Barbell Shrug', type:'lift', group:'Shoulders', eq:'barbell', bar:true},
  {id:'dbshrug', name:'Dumbbell Shrug', type:'lift', group:'Shoulders', eq:'dumbbell'},
  // Back
  {id:'deadlift', name:'Deadlift', type:'lift', group:'Back', eq:'barbell', bar:true},
  {id:'sumo', name:'Sumo Deadlift', type:'lift', group:'Back', eq:'barbell', bar:true},
  {id:'trapbar', name:'Trap Bar Deadlift', type:'lift', group:'Back', eq:'trap bar', bar:true},
  {id:'rackpull', name:'Rack Pull', type:'lift', group:'Back', eq:'barbell', bar:true},
  {id:'row', name:'Barbell Row', type:'lift', group:'Back', eq:'barbell', bar:true},
  {id:'pendlay', name:'Pendlay Row', type:'lift', group:'Back', eq:'barbell', bar:true},
  {id:'tbar', name:'T-Bar Row', type:'lift', group:'Back', eq:'barbell'},
  {id:'meadows', name:'Meadows Row', type:'lift', group:'Back', eq:'landmine'},
  {id:'dbrow', name:'Dumbbell Row', type:'lift', group:'Back', eq:'dumbbell'},
  {id:'csrow', name:'Chest-Supported Row', type:'lift', group:'Back', eq:'dumbbell'},
  {id:'cablerow', name:'Seated Cable Row', type:'lift', group:'Back', eq:'cable'},
  {id:'sacablerow', name:'Single-Arm Cable Row', type:'lift', group:'Back', eq:'cable'},
  {id:'machrow', name:'Machine Row', type:'lift', group:'Back', eq:'machine'},
  {id:'pulldown', name:'Lat Pulldown', type:'lift', group:'Back', eq:'cable'},
  {id:'cgpulldown', name:'Close-Grip Pulldown', type:'lift', group:'Back', eq:'cable'},
  {id:'sapulldown', name:'Straight-Arm Pulldown', type:'lift', group:'Back', eq:'cable'},
  {id:'pullup', name:'Pull-up', type:'lift', group:'Back', eq:'bodyweight', bw:true, k:"weighted belt"},
  {id:'chinup', name:'Chin-up', type:'lift', group:'Back', eq:'bodyweight', bw:true, k:"weighted belt"},
  {id:'ngpullup', name:'Neutral-Grip Pull-up', type:'lift', group:'Back', eq:'bodyweight', bw:true},
  {id:'astpullup', name:'Assisted Pull-up', type:'lift', group:'Back', eq:'machine'},
  {id:'invrow', name:'Inverted Row', type:'lift', group:'Back', eq:'bodyweight', bw:true},
  {id:'goodmorning', name:'Good Morning', type:'lift', group:'Back', eq:'barbell', bar:true},
  {id:'backext', name:'Back Extension', type:'lift', group:'Back', eq:'bodyweight', bw:true, k:"weighted hyperextension 45 degree"},
  {id:'deadhang', name:'Dead Hang', type:'lift', group:'Back', eq:'bodyweight', bw:true, time:true},
  // Arms
  {id:'curl', name:'Barbell Curl', type:'lift', group:'Arms', eq:'barbell', bar:true},
  {id:'ezcurl', name:'EZ-Bar Curl', type:'lift', group:'Arms', eq:'EZ bar'},
  {id:'dbcurl', name:'Dumbbell Curl', type:'lift', group:'Arms', eq:'dumbbell'},
  {id:'hammer', name:'Hammer Curl', type:'lift', group:'Arms', eq:'dumbbell'},
  {id:'inccurl', name:'Incline Dumbbell Curl', type:'lift', group:'Arms', eq:'dumbbell'},
  {id:'preacher', name:'Preacher Curl', type:'lift', group:'Arms', eq:'EZ bar'},
  {id:'conccurl', name:'Concentration Curl', type:'lift', group:'Arms', eq:'dumbbell'},
  {id:'spider', name:'Spider Curl', type:'lift', group:'Arms', eq:'dumbbell'},
  {id:'cablecurl', name:'Cable Curl', type:'lift', group:'Arms', eq:'cable'},
  {id:'machcurl', name:'Machine Curl', type:'lift', group:'Arms', eq:'machine'},
  {id:'revcurl', name:'Reverse Curl', type:'lift', group:'Arms', eq:'EZ bar'},
  {id:'pushdown', name:'Triceps Pushdown', type:'lift', group:'Arms', eq:'cable'},
  {id:'ropepushdown', name:'Rope Pushdown', type:'lift', group:'Arms', eq:'cable'},
  {id:'ohtri', name:'Overhead Triceps Extension', type:'lift', group:'Arms', eq:'dumbbell'},
  {id:'cableoh', name:'Cable Overhead Extension', type:'lift', group:'Arms', eq:'cable'},
  {id:'skull', name:'Skull Crusher', type:'lift', group:'Arms', eq:'EZ bar'},
  {id:'dbskull', name:'Dumbbell Skull Crusher', type:'lift', group:'Arms', eq:'dumbbell'},
  {id:'kickback', name:'Triceps Kickback', type:'lift', group:'Arms', eq:'dumbbell'},
  {id:'machdip', name:'Machine Dip', type:'lift', group:'Arms', eq:'machine'},
  {id:'benchdip', name:'Bench Dip', type:'lift', group:'Arms', eq:'bodyweight', bw:true},
  {id:'cgpushup', name:'Close-Grip Push-up', type:'lift', group:'Arms', eq:'bodyweight', bw:true},
  {id:'wristcurl', name:'Wrist Curl', type:'lift', group:'Arms', eq:'dumbbell'},
  {id:'revwrist', name:'Reverse Wrist Curl', type:'lift', group:'Arms', eq:'dumbbell'},
  // Legs
  {id:'squat', name:'Back Squat', type:'lift', group:'Legs', eq:'barbell', bar:true},
  {id:'frontsquat', name:'Front Squat', type:'lift', group:'Legs', eq:'barbell', bar:true},
  {id:'boxsquat', name:'Box Squat', type:'lift', group:'Legs', eq:'barbell', bar:true},
  {id:'pausesquat', name:'Pause Squat', type:'lift', group:'Legs', eq:'barbell', bar:true},
  {id:'ssbsquat', name:'Safety Bar Squat', type:'lift', group:'Legs', eq:'barbell', bar:true},
  {id:'smithsquat', name:'Smith Machine Squat', type:'lift', group:'Legs', eq:'smith'},
  {id:'hacksquat', name:'Hack Squat', type:'lift', group:'Legs', eq:'machine', k:"machine quads"},
  {id:'legpress', name:'Leg Press', type:'lift', group:'Legs', eq:'machine'},
  {id:'beltsquat', name:'Belt Squat', type:'lift', group:'Legs', eq:'machine'},
  {id:'goblet', name:'Goblet Squat', type:'lift', group:'Legs', eq:'dumbbell'},
  {id:'bss', name:'Bulgarian Split Squat', type:'lift', group:'Legs', eq:'dumbbell'},
  {id:'lunge', name:'Walking Lunge', type:'lift', group:'Legs', eq:'dumbbell'},
  {id:'revlunge', name:'Reverse Lunge', type:'lift', group:'Legs', eq:'dumbbell'},
  {id:'stepup', name:'Step-up', type:'lift', group:'Legs', eq:'dumbbell'},
  {id:'legext', name:'Leg Extension', type:'lift', group:'Legs', eq:'machine'},
  {id:'sissy', name:'Sissy Squat', type:'lift', group:'Legs', eq:'bodyweight', bw:true},
  {id:'pistol', name:'Pistol Squat', type:'lift', group:'Legs', eq:'bodyweight', bw:true, k:"weighted single leg"},
  {id:'rdl', name:'Romanian Deadlift', type:'lift', group:'Legs', eq:'barbell', bar:true},
  {id:'dbrdl', name:'Dumbbell Romanian Deadlift', type:'lift', group:'Legs', eq:'dumbbell'},
  {id:'slrdl', name:'Single-Leg Romanian Deadlift', type:'lift', group:'Legs', eq:'dumbbell'},
  {id:'sldl', name:'Stiff-Leg Deadlift', type:'lift', group:'Legs', eq:'barbell', bar:true},
  {id:'legcurl', name:'Leg Curl', type:'lift', group:'Legs', eq:'machine'},
  {id:'seatedcurl', name:'Seated Leg Curl', type:'lift', group:'Legs', eq:'machine'},
  {id:'nordic', name:'Nordic Curl', type:'lift', group:'Legs', eq:'bodyweight', bw:true},
  {id:'ghr', name:'Glute-Ham Raise', type:'lift', group:'Legs', eq:'bodyweight', bw:true},
  {id:'hipthrust', name:'Hip Thrust', type:'lift', group:'Legs', eq:'barbell', bar:true},
  {id:'machhip', name:'Machine Hip Thrust', type:'lift', group:'Legs', eq:'machine', k:"glute drive belt plate loaded"},
  {id:'glutebridge', name:'Glute Bridge', type:'lift', group:'Legs', eq:'bodyweight', bw:true},
  {id:'cablekick', name:'Cable Kickback', type:'lift', group:'Legs', eq:'cable'},
  {id:'abduction', name:'Hip Abduction', type:'lift', group:'Legs', eq:'machine'},
  {id:'adduction', name:'Hip Adduction', type:'lift', group:'Legs', eq:'machine'},
  {id:'kbswing', name:'Kettlebell Swing', type:'lift', group:'Legs', eq:'kettlebell'},
  {id:'calf', name:'Standing Calf Raise', type:'lift', group:'Legs', eq:'machine'},
  {id:'seatedcalf', name:'Seated Calf Raise', type:'lift', group:'Legs', eq:'machine'},
  {id:'lpcalf', name:'Leg Press Calf Raise', type:'lift', group:'Legs', eq:'machine'},
  {id:'donkey', name:'Donkey Calf Raise', type:'lift', group:'Legs', eq:'machine'},
  // Core
  {id:'legraise', name:'Hanging Leg Raise', type:'lift', group:'Core', eq:'bodyweight', bw:true},
  {id:'kneeraise', name:'Hanging Knee Raise', type:'lift', group:'Core', eq:'bodyweight', bw:true},
  {id:'cablecrunch', name:'Cable Crunch', type:'lift', group:'Core', eq:'cable'},
  {id:'machcrunch', name:'Machine Crunch', type:'lift', group:'Core', eq:'machine'},
  {id:'abwheel', name:'Ab Wheel', type:'lift', group:'Core', eq:'bodyweight', bw:true},
  {id:'crunch', name:'Crunch', type:'lift', group:'Core', eq:'bodyweight', bw:true, k:"weighted plate"},
  {id:'declinesitup', name:'Decline Sit-up', type:'lift', group:'Core', eq:'bodyweight', bw:true},
  {id:'deadbug', name:'Dead Bug', type:'lift', group:'Core', eq:'bodyweight', bw:true},
  {id:'russian', name:'Russian Twist', type:'lift', group:'Core', eq:'other'},
  {id:'pallof', name:'Pallof Press', type:'lift', group:'Core', eq:'cable'},
  {id:'woodchop', name:'Cable Woodchop', type:'lift', group:'Core', eq:'cable'},
  {id:'plank', name:'Plank', type:'lift', group:'Core', eq:'bodyweight', bw:true, time:true},
  {id:'sideplank', name:'Side Plank', type:'lift', group:'Core', eq:'bodyweight', bw:true, time:true, k:"weighted"},
  {id:'farmers', name:"Farmer's Carry", type:'lift', group:'Core', eq:'dumbbell', time:true, k:"walk kettlebell strongman handles"},
  {id:'suitcase', name:'Suitcase Carry', type:'lift', group:'Core', eq:'dumbbell', time:true},
  // Full body
  {id:'powerclean', name:'Power Clean', type:'lift', group:'Full body', eq:'barbell', bar:true},
  {id:'hangclean', name:'Hang Clean', type:'lift', group:'Full body', eq:'barbell', bar:true},
  {id:'cleanjerk', name:'Clean and Jerk', type:'lift', group:'Full body', eq:'barbell', bar:true},
  {id:'snatch', name:'Snatch', type:'lift', group:'Full body', eq:'barbell', bar:true},
  {id:'thruster', name:'Thruster', type:'lift', group:'Full body', eq:'barbell', bar:true},
  {id:'kbcleanpress', name:'Kettlebell Clean and Press', type:'lift', group:'Full body', eq:'kettlebell'},
  {id:'tgu', name:'Turkish Get-up', type:'lift', group:'Full body', eq:'kettlebell'},
  {id:'burpee', name:'Burpee', type:'lift', group:'Full body', eq:'bodyweight', bw:true},
  {id:'boxjump', name:'Box Jump', type:'lift', group:'Full body', eq:'bodyweight', bw:true},
  {id:'wallball', name:'Wall Ball', type:'lift', group:'Full body', eq:'other'},
  // Cardio
  {id:'run', name:'Run', type:'cardio', group:'Cardio', eq:'outdoors'},
  {id:'treadmill', name:'Treadmill Run', type:'cardio', group:'Cardio', eq:'treadmill'},
  {id:'inclinewalk', name:'Incline Walk', type:'cardio', group:'Cardio', eq:'treadmill'},
  {id:'walk', name:'Walk', type:'cardio', group:'Cardio', eq:'outdoors'},
  {id:'hike', name:'Hike', type:'cardio', group:'Cardio', eq:'outdoors'},
  {id:'sprints', name:'Sprints', type:'cardio', group:'Cardio', eq:'outdoors'},
  {id:'bike', name:'Bike', type:'cardio', group:'Cardio', eq:'bike'},
  {id:'assaultbike', name:'Air Bike', type:'cardio', group:'Cardio', eq:'bike', k:"echo bike fan assault rogue"},
  {id:'rower', name:'Rowing Machine', type:'cardio', group:'Cardio', eq:'rower', k:"concept2 erg rowing"},
  {id:'skierg', name:'Ski Erg', type:'cardio', group:'Cardio', eq:'machine', k:"concept2"},
  {id:'stairs', name:'Stair Climber', type:'cardio', group:'Cardio', eq:'machine', k:"stairmaster"},
  {id:'elliptical', name:'Elliptical', type:'cardio', group:'Cardio', eq:'machine', k:"cross trainer"},
  {id:'swim', name:'Swim', type:'cardio', group:'Cardio', eq:'pool'},
  {id:'jumprope', name:'Jump Rope', type:'cardio', group:'Cardio', eq:'other'},
  {id:'sledpush', name:'Sled Push', type:'cardio', group:'Cardio', eq:'sled'},
  {id:'ropes', name:'Battle Ropes', type:'cardio', group:'Cardio', eq:'other'},
  // Added in the library expansion (v2.1)
  {id:"wgbench", name:"Wide-Grip Bench Press", type:'lift', group:"Chest", eq:"barbell", bar:true, k:"wide grip"},
  {id:"pausebench", name:"Paused Bench Press", type:'lift', group:"Chest", eq:"barbell", bar:true, k:"pause competition"},
  {id:"spoto", name:"Spoto Press", type:'lift', group:"Chest", eq:"barbell", bar:true, k:"paused above chest"},
  {id:"boardpress", name:"Board Press", type:'lift', group:"Chest", eq:"barbell", bar:true, k:"partial"},
  {id:"revgripbench", name:"Reverse-Grip Bench Press", type:'lift', group:"Chest", eq:"barbell", bar:true, k:"underhand"},
  {id:"guillotine", name:"Guillotine Press", type:'lift', group:"Chest", eq:"barbell", bar:true, k:"neck press"},
  {id:"smithinc", name:"Smith Machine Incline Press", type:'lift', group:"Chest", eq:"smith"},
  {id:"smithdec", name:"Smith Machine Decline Press", type:'lift', group:"Chest", eq:"smith"},
  {id:"dbfloor", name:"Dumbbell Floor Press", type:'lift', group:"Chest", eq:"dumbbell", k:"db"},
  {id:"sadbbench", name:"Single-Arm Dumbbell Bench Press", type:'lift', group:"Chest", eq:"dumbbell", k:"one arm db"},
  {id:"dbsqueeze", name:"Dumbbell Squeeze Press", type:'lift', group:"Chest", eq:"dumbbell", k:"crush press db"},
  {id:"decdbfly", name:"Decline Dumbbell Fly", type:'lift', group:"Chest", eq:"dumbbell", k:"db flye"},
  {id:"machfly", name:"Machine Fly", type:'lift', group:"Chest", eq:"machine", k:"chest fly"},
  {id:"decmachpress", name:"Decline Machine Press", type:'lift', group:"Chest", eq:"machine"},
  {id:"hammerchest", name:"Hammer Strength Chest Press", type:'lift', group:"Chest", eq:"machine", k:"iso lateral plate loaded"},
  {id:"hammerinc", name:"Hammer Strength Incline Press", type:'lift', group:"Chest", eq:"machine", k:"iso lateral plate loaded"},
  {id:"cablepress", name:"Cable Chest Press", type:'lift', group:"Chest", eq:"cable", k:"standing press"},
  {id:"sacablefly", name:"Single-Arm Cable Fly", type:'lift', group:"Chest", eq:"cable", k:"one arm"},
  {id:"svend", name:"Svend Press", type:'lift', group:"Chest", eq:"other", k:"plate press"},
  {id:"inclinepushup", name:"Incline Push-up", type:'lift', group:"Chest", eq:"bodyweight", bw:true, k:"hands elevated"},
  {id:"deficitpushup", name:"Deficit Push-up", type:'lift', group:"Chest", eq:"bodyweight", bw:true, k:"handles deep"},
  {id:"diamondpushup", name:"Diamond Push-up", type:'lift', group:"Chest", eq:"bodyweight", bw:true, k:"triangle"},
  {id:"archerpushup", name:"Archer Push-up", type:'lift', group:"Chest", eq:"bodyweight", bw:true},
  {id:"bandpushup", name:"Banded Push-up", type:'lift', group:"Chest", eq:"band", bw:true, k:"resistance band"},
  {id:"pushuplus", name:"Push-up Plus", type:'lift', group:"Chest", eq:"bodyweight", bw:true, k:"serratus scap"},
  {id:"ringdip", name:"Ring Dip", type:'lift', group:"Chest", eq:"bodyweight", bw:true, k:"gymnastic rings"},
  {id:"ringpushup", name:"Ring Push-up", type:'lift', group:"Chest", eq:"bodyweight", bw:true, k:"gymnastic rings"},
  {id:"zpress", name:"Z Press", type:'lift', group:"Shoulders", eq:"barbell", bar:true, k:"seated floor press"},
  {id:"btnpress", name:"Behind-the-Neck Press", type:'lift', group:"Shoulders", eq:"barbell", bar:true, k:"btn"},
  {id:"bradford", name:"Bradford Press", type:'lift', group:"Shoulders", eq:"barbell", bar:true},
  {id:"smithohp", name:"Smith Machine Shoulder Press", type:'lift', group:"Shoulders", eq:"smith", k:"overhead"},
  {id:"viking", name:"Viking Press", type:'lift', group:"Shoulders", eq:"machine", k:"landmine attachment"},
  {id:"seateddbohp", name:"Seated Dumbbell Press", type:'lift', group:"Shoulders", eq:"dumbbell", k:"db shoulder press"},
  {id:"sadbohp", name:"Single-Arm Dumbbell Shoulder Press", type:'lift', group:"Shoulders", eq:"dumbbell", k:"one arm overhead"},
  {id:"dbpushpress", name:"Dumbbell Push Press", type:'lift', group:"Shoulders", eq:"dumbbell", k:"db"},
  {id:"kbpress", name:"Kettlebell Press", type:'lift', group:"Shoulders", eq:"kettlebell", k:"kb overhead strict"},
  {id:"kbpushpress", name:"Kettlebell Push Press", type:'lift', group:"Shoulders", eq:"kettlebell", k:"kb"},
  {id:"leanlat", name:"Leaning Lateral Raise", type:'lift', group:"Shoulders", eq:"dumbbell", k:"side raise"},
  {id:"seatedlat", name:"Seated Lateral Raise", type:'lift', group:"Shoulders", eq:"dumbbell", k:"side raise"},
  {id:"cablefront", name:"Cable Front Raise", type:'lift', group:"Shoulders", eq:"cable"},
  {id:"platefront", name:"Plate Front Raise", type:'lift', group:"Shoulders", eq:"other"},
  {id:"cablerear", name:"Cable Rear Delt Fly", type:'lift', group:"Shoulders", eq:"cable", k:"reverse fly"},
  {id:"increar", name:"Incline Rear Delt Raise", type:'lift', group:"Shoulders", eq:"dumbbell", k:"chest supported reverse fly"},
  {id:"bandpull", name:"Band Pull-Apart", type:'lift', group:"Shoulders", eq:"band", k:"rear delt"},
  {id:"ytw", name:"Y-T-W Raise", type:'lift', group:"Shoulders", eq:"dumbbell", k:"prone"},
  {id:"cubanpress", name:"Cuban Press", type:'lift', group:"Shoulders", eq:"dumbbell", k:"rotator"},
  {id:"dbuprightrow", name:"Dumbbell Upright Row", type:'lift', group:"Shoulders", eq:"dumbbell", k:"db"},
  {id:"cableupright", name:"Cable Upright Row", type:'lift', group:"Shoulders", eq:"cable"},
  {id:"trapbarshrug", name:"Trap Bar Shrug", type:'lift', group:"Shoulders", eq:"trap bar", bar:true, k:"hex bar"},
  {id:"smithshrug", name:"Smith Machine Shrug", type:'lift', group:"Shoulders", eq:"smith"},
  {id:"cableshrug", name:"Cable Shrug", type:'lift', group:"Shoulders", eq:"cable"},
  {id:"hspu", name:"Handstand Push-up", type:'lift', group:"Shoulders", eq:"bodyweight", bw:true, k:"hspu wall"},
  {id:"pikepushup", name:"Pike Push-up", type:'lift', group:"Shoulders", eq:"bodyweight", bw:true},
  {id:"externalrot", name:"Cable External Rotation", type:'lift', group:"Shoulders", eq:"cable", k:"rotator cuff"},
  {id:"internalrot", name:"Cable Internal Rotation", type:'lift', group:"Shoulders", eq:"cable", k:"rotator cuff"},
  {id:"dbextrot", name:"Dumbbell External Rotation", type:'lift', group:"Shoulders", eq:"dumbbell", k:"rotator cuff side lying"},
  {id:"bandextrot", name:"Band External Rotation", type:'lift', group:"Shoulders", eq:"band", k:"rotator cuff"},
  {id:"deficitdl", name:"Deficit Deadlift", type:'lift', group:"Back", eq:"barbell", bar:true},
  {id:"pausedl", name:"Paused Deadlift", type:'lift', group:"Back", eq:"barbell", bar:true},
  {id:"blockpull", name:"Block Pull", type:'lift', group:"Back", eq:"barbell", bar:true, k:"elevated deadlift"},
  {id:"snatchdl", name:"Snatch-Grip Deadlift", type:'lift', group:"Back", eq:"barbell", bar:true, k:"wide grip"},
  {id:"trapbarhigh", name:"Trap Bar Deadlift (High Handles)", type:'lift', group:"Back", eq:"trap bar", bar:true, k:"hex bar"},
  {id:"yates", name:"Yates Row", type:'lift', group:"Back", eq:"barbell", bar:true, k:"underhand row"},
  {id:"sealrow", name:"Seal Row", type:'lift', group:"Back", eq:"barbell", bar:true, k:"bench row"},
  {id:"dbsealrow", name:"Dumbbell Seal Row", type:'lift', group:"Back", eq:"dumbbell", k:"bench row"},
  {id:"kroc", name:"Kroc Row", type:'lift', group:"Back", eq:"dumbbell", k:"heavy db row"},
  {id:"incdbrow", name:"Incline Dumbbell Row", type:'lift', group:"Back", eq:"dumbbell", k:"chest supported db"},
  {id:"landminerow", name:"Landmine Row", type:'lift', group:"Back", eq:"landmine"},
  {id:"smithrow", name:"Smith Machine Row", type:'lift', group:"Back", eq:"smith"},
  {id:"hsrow", name:"Hammer Strength Row", type:'lift', group:"Back", eq:"machine", k:"iso lateral plate loaded"},
  {id:"hsrowhigh", name:"Machine High Row", type:'lift', group:"Back", eq:"machine", k:"iso lateral"},
  {id:"machpulldown", name:"Machine Pulldown", type:'lift', group:"Back", eq:"machine", k:"plate loaded"},
  {id:"wgpulldown", name:"Wide-Grip Pulldown", type:'lift', group:"Back", eq:"cable", k:"lat pull down"},
  {id:"ngpulldown", name:"Neutral-Grip Pulldown", type:'lift', group:"Back", eq:"cable", k:"lat pull down"},
  {id:"onearmpulldown", name:"Single-Arm Pulldown", type:'lift', group:"Back", eq:"cable", k:"one arm lat"},
  {id:"wgcablerow", name:"Wide-Grip Cable Row", type:'lift', group:"Back", eq:"cable", k:"seated row"},
  {id:"lowcablerow", name:"Low Cable Row", type:'lift', group:"Back", eq:"cable", k:"standing row"},
  {id:"cablepullover", name:"Cable Pullover", type:'lift', group:"Back", eq:"cable", k:"rope lat"},
  {id:"wgpullup", name:"Wide-Grip Pull-up", type:'lift', group:"Back", eq:"bodyweight", bw:true},
  {id:"astchinup", name:"Assisted Chin-up", type:'lift', group:"Back", eq:"machine"},
  {id:"bandpullup", name:"Band-Assisted Pull-up", type:'lift', group:"Back", eq:"band", bw:true, k:"resistance band"},
  {id:"muscleup", name:"Muscle-up", type:'lift', group:"Back", eq:"bodyweight", bw:true, k:"bar ring"},
  {id:"ringrow", name:"Ring Row", type:'lift', group:"Back", eq:"bodyweight", bw:true, k:"gymnastic rings"},
  {id:"trxrow", name:"TRX Row", type:'lift', group:"Back", eq:"bodyweight", bw:true, k:"suspension"},
  {id:"scappullup", name:"Scapular Pull-up", type:'lift', group:"Back", eq:"bodyweight", bw:true, k:"scap"},
  {id:"reversehyper", name:"Reverse Hyperextension", type:'lift', group:"Back", eq:"machine"},
  {id:"hyper45", name:"45-Degree Hyperextension", type:'lift', group:"Back", eq:"bodyweight", bw:true, k:"back extension"},
  {id:"superman", name:"Superman", type:'lift', group:"Back", eq:"bodyweight", bw:true, k:"lower back"},
  {id:"jeffersoncurl", name:"Jefferson Curl", type:'lift', group:"Back", eq:"dumbbell", k:"mobility"},
  {id:"dragcurl", name:"Drag Curl", type:'lift', group:"Arms", eq:"barbell", bar:true},
  {id:"wgcurl", name:"Wide-Grip Barbell Curl", type:'lift', group:"Arms", eq:"barbell", bar:true},
  {id:"bbwristcurl", name:"Barbell Wrist Curl", type:'lift', group:"Arms", eq:"barbell", bar:true, k:"forearm"},
  {id:"zottman", name:"Zottman Curl", type:'lift', group:"Arms", eq:"dumbbell", k:"db forearm"},
  {id:"crossbody", name:"Cross-Body Hammer Curl", type:'lift', group:"Arms", eq:"dumbbell", k:"db"},
  {id:"altcurl", name:"Alternating Dumbbell Curl", type:'lift', group:"Arms", eq:"dumbbell", k:"db"},
  {id:"dbpreacher", name:"Dumbbell Preacher Curl", type:'lift', group:"Arms", eq:"dumbbell", k:"db"},
  {id:"machpreacher", name:"Machine Preacher Curl", type:'lift', group:"Arms", eq:"machine"},
  {id:"bayesian", name:"Bayesian Cable Curl", type:'lift', group:"Arms", eq:"cable", k:"behind body"},
  {id:"ropecurl", name:"Rope Hammer Curl", type:'lift', group:"Arms", eq:"cable"},
  {id:"highcablecurl", name:"High Cable Curl", type:'lift', group:"Arms", eq:"cable", k:"crucifix"},
  {id:"bandcurl", name:"Band Curl", type:'lift', group:"Arms", eq:"band", k:"resistance band"},
  {id:"jmpress", name:"JM Press", type:'lift', group:"Arms", eq:"barbell", bar:true, k:"triceps"},
  {id:"tatepress", name:"Tate Press", type:'lift', group:"Arms", eq:"dumbbell", k:"triceps db"},
  {id:"ezoh", name:"EZ-Bar Overhead Extension", type:'lift', group:"Arms", eq:"EZ bar", k:"french press triceps"},
  {id:"saoh", name:"Single-Arm Overhead Extension", type:'lift', group:"Arms", eq:"dumbbell", k:"one arm triceps"},
  {id:"sapushdown", name:"Single-Arm Pushdown", type:'lift', group:"Arms", eq:"cable", k:"one arm triceps"},
  {id:"revpushdown", name:"Reverse-Grip Pushdown", type:'lift', group:"Arms", eq:"cable", k:"underhand triceps"},
  {id:"vbarpushdown", name:"V-Bar Pushdown", type:'lift', group:"Arms", eq:"cable", k:"triceps"},
  {id:"cabletrikick", name:"Cable Triceps Kickback", type:'lift', group:"Arms", eq:"cable"},
  {id:"machtri", name:"Machine Triceps Extension", type:'lift', group:"Arms", eq:"machine"},
  {id:"bandpushdown", name:"Band Pushdown", type:'lift', group:"Arms", eq:"band", k:"triceps"},
  {id:"astdip", name:"Assisted Dip", type:'lift', group:"Arms", eq:"machine"},
  {id:"platepinch", name:"Plate Pinch", type:'lift', group:"Arms", eq:"other", time:true, k:"grip hold"},
  {id:"wristroller", name:"Wrist Roller", type:'lift', group:"Arms", eq:"other", k:"forearm"},
  {id:"gripper", name:"Hand Gripper", type:'lift', group:"Arms", eq:"other", k:"grip"},
  {id:"deadhangwt", name:"Weighted Dead Hang", type:'lift', group:"Arms", eq:"bodyweight", bw:true, time:true, k:"grip"},
  {id:"highbar", name:"High-Bar Squat", type:'lift', group:"Legs", eq:"barbell", bar:true, k:"back squat"},
  {id:"lowbar", name:"Low-Bar Squat", type:'lift', group:"Legs", eq:"barbell", bar:true, k:"back squat powerlifting"},
  {id:"zercher", name:"Zercher Squat", type:'lift', group:"Legs", eq:"barbell", bar:true},
  {id:"ohsquat", name:"Overhead Squat", type:'lift', group:"Legs", eq:"barbell", bar:true, k:"ohs"},
  {id:"pinsquat", name:"Pin Squat", type:'lift', group:"Legs", eq:"barbell", bar:true, k:"dead stop"},
  {id:"bblunge", name:"Barbell Lunge", type:'lift', group:"Legs", eq:"barbell", bar:true},
  {id:"seatedgm", name:"Seated Good Morning", type:'lift', group:"Legs", eq:"barbell", bar:true},
  {id:"bbglutebridge", name:"Barbell Glute Bridge", type:'lift', group:"Legs", eq:"barbell", bar:true},
  {id:"landminesquat", name:"Landmine Squat", type:'lift', group:"Legs", eq:"landmine"},
  {id:"dbsquat", name:"Dumbbell Squat", type:'lift', group:"Legs", eq:"dumbbell", k:"db"},
  {id:"sumosquat", name:"Sumo Squat", type:'lift', group:"Legs", eq:"dumbbell", k:"plie db"},
  {id:"splitsquat", name:"Split Squat", type:'lift', group:"Legs", eq:"dumbbell", k:"static lunge db"},
  {id:"curtsy", name:"Curtsy Lunge", type:'lift', group:"Legs", eq:"dumbbell"},
  {id:"latlunge", name:"Lateral Lunge", type:'lift', group:"Legs", eq:"dumbbell", k:"side lunge cossack"},
  {id:"deficitlunge", name:"Deficit Reverse Lunge", type:'lift', group:"Legs", eq:"dumbbell"},
  {id:"dbhipthrust", name:"Dumbbell Hip Thrust", type:'lift', group:"Legs", eq:"dumbbell", k:"db glute"},
  {id:"dbcalf", name:"Dumbbell Calf Raise", type:'lift', group:"Legs", eq:"dumbbell", k:"db"},
  {id:"kbfrontsquat", name:"Kettlebell Front Squat", type:'lift', group:"Legs", eq:"kettlebell", k:"kb double"},
  {id:"kbdeadlift", name:"Kettlebell Deadlift", type:'lift', group:"Legs", eq:"kettlebell", k:"kb"},
  {id:"kbrdl", name:"Kettlebell Romanian Deadlift", type:'lift', group:"Legs", eq:"kettlebell", k:"kb rdl"},
  {id:"kblunge", name:"Kettlebell Lunge", type:'lift', group:"Legs", eq:"kettlebell", k:"kb"},
  {id:"trapbarrdl", name:"Trap Bar Romanian Deadlift", type:'lift', group:"Legs", eq:"trap bar", bar:true, k:"hex bar rdl"},
  {id:"smithrdl", name:"Smith Machine Romanian Deadlift", type:'lift', group:"Legs", eq:"smith", k:"rdl"},
  {id:"smithlunge", name:"Smith Machine Lunge", type:'lift', group:"Legs", eq:"smith", k:"split squat"},
  {id:"smithcalf", name:"Smith Machine Calf Raise", type:'lift', group:"Legs", eq:"smith"},
  {id:"pendulum", name:"Pendulum Squat", type:'lift', group:"Legs", eq:"machine", k:"machine quads"},
  {id:"vsquat", name:"V-Squat", type:'lift', group:"Legs", eq:"machine", k:"hack"},
  {id:"horizlegpress", name:"Horizontal Leg Press", type:'lift', group:"Legs", eq:"machine", k:"seated"},
  {id:"sllegpress", name:"Single-Leg Press", type:'lift', group:"Legs", eq:"machine", k:"one leg"},
  {id:"sllegext", name:"Single-Leg Extension", type:'lift', group:"Legs", eq:"machine", k:"one leg quad"},
  {id:"standinglegcurl", name:"Standing Leg Curl", type:'lift', group:"Legs", eq:"machine", k:"hamstring"},
  {id:"sllegcurl", name:"Single-Leg Curl", type:'lift', group:"Legs", eq:"machine", k:"one leg hamstring"},
  {id:"gluteextension", name:"Glute Kickback Machine", type:'lift', group:"Legs", eq:"machine", k:"glute drive"},
  {id:"cablepullthrough", name:"Cable Pull-Through", type:'lift', group:"Legs", eq:"cable", k:"hinge glute"},
  {id:"cableabd", name:"Cable Hip Abduction", type:'lift', group:"Legs", eq:"cable"},
  {id:"cableadd", name:"Cable Hip Adduction", type:'lift', group:"Legs", eq:"cable"},
  {id:"cablehipflex", name:"Cable Hip Flexion", type:'lift', group:"Legs", eq:"cable", k:"hip flexor"},
  {id:"monsterwalk", name:"Monster Walk", type:'lift', group:"Legs", eq:"band", k:"banded side step"},
  {id:"clamshell", name:"Clamshell", type:'lift', group:"Legs", eq:"band", k:"glute med"},
  {id:"bandgoodmorning", name:"Band Good Morning", type:'lift', group:"Legs", eq:"band"},
  {id:"airsquat", name:"Bodyweight Squat", type:'lift', group:"Legs", eq:"bodyweight", bw:true, k:"air squat"},
  {id:"jumpsquat", name:"Jump Squat", type:'lift', group:"Legs", eq:"bodyweight", bw:true, k:"plyo"},
  {id:"wallsit", name:"Wall Sit", type:'lift', group:"Legs", eq:"bodyweight", bw:true, time:true, k:"isometric"},
  {id:"slhipthrust", name:"Single-Leg Hip Thrust", type:'lift', group:"Legs", eq:"bodyweight", bw:true, k:"one leg glute"},
  {id:"slglutebridge", name:"Single-Leg Glute Bridge", type:'lift', group:"Legs", eq:"bodyweight", bw:true},
  {id:"frogpump", name:"Frog Pump", type:'lift', group:"Legs", eq:"bodyweight", bw:true, k:"glute"},
  {id:"reversenordic", name:"Reverse Nordic", type:'lift', group:"Legs", eq:"bodyweight", bw:true, k:"quad"},
  {id:"slcalf", name:"Single-Leg Calf Raise", type:'lift', group:"Legs", eq:"bodyweight", bw:true, k:"one leg"},
  {id:"tibraise", name:"Tibialis Raise", type:'lift', group:"Legs", eq:"bodyweight", bw:true, k:"shin"},
  {id:"copenhagen", name:"Copenhagen Plank", type:'lift', group:"Legs", eq:"bodyweight", bw:true, time:true, k:"adductor"},
  {id:"broadjump", name:"Broad Jump", type:'lift', group:"Legs", eq:"bodyweight", bw:true, k:"standing long jump"},
  {id:"skaterjump", name:"Skater Jump", type:'lift', group:"Legs", eq:"bodyweight", bw:true, k:"lateral bound"},
  {id:"lungejump", name:"Jumping Lunge", type:'lift', group:"Legs", eq:"bodyweight", bw:true, k:"plyo"},
  {id:"shrimp", name:"Shrimp Squat", type:'lift', group:"Legs", eq:"bodyweight", bw:true, k:"single leg"},
  {id:"situp", name:"Sit-up", type:'lift', group:"Core", eq:"bodyweight", bw:true},
  {id:"vup", name:"V-up", type:'lift', group:"Core", eq:"bodyweight", bw:true},
  {id:"bicycle", name:"Bicycle Crunch", type:'lift', group:"Core", eq:"bodyweight", bw:true},
  {id:"reversecrunch", name:"Reverse Crunch", type:'lift', group:"Core", eq:"bodyweight", bw:true},
  {id:"obliquecrunch", name:"Oblique Crunch", type:'lift', group:"Core", eq:"bodyweight", bw:true, k:"side crunch"},
  {id:"toestobar", name:"Toes-to-Bar", type:'lift', group:"Core", eq:"bodyweight", bw:true, k:"hanging"},
  {id:"captainchair", name:"Captain's Chair Leg Raise", type:'lift', group:"Core", eq:"bodyweight", bw:true, k:"roman chair"},
  {id:"lyinglegraise", name:"Lying Leg Raise", type:'lift', group:"Core", eq:"bodyweight", bw:true},
  {id:"flutter", name:"Flutter Kick", type:'lift', group:"Core", eq:"bodyweight", bw:true, time:true},
  {id:"hollow", name:"Hollow Hold", type:'lift', group:"Core", eq:"bodyweight", bw:true, time:true, k:"hollow body"},
  {id:"lsit", name:"L-Sit", type:'lift', group:"Core", eq:"bodyweight", bw:true, time:true, k:"parallettes"},
  {id:"dragonflag", name:"Dragon Flag", type:'lift', group:"Core", eq:"bodyweight", bw:true},
  {id:"birddog", name:"Bird Dog", type:'lift', group:"Core", eq:"bodyweight", bw:true},
  {id:"mountainclimber", name:"Mountain Climber", type:'lift', group:"Core", eq:"bodyweight", bw:true, time:true},
  {id:"bodysaw", name:"Body Saw", type:'lift', group:"Core", eq:"bodyweight", bw:true, k:"plank sliders"},
  {id:"plankweighted", name:"Weighted Plank", type:'lift', group:"Core", eq:"bodyweight", bw:true, time:true},
  {id:"rkcplank", name:"RKC Plank", type:'lift', group:"Core", eq:"bodyweight", bw:true, time:true, k:"hard style"},
  {id:"sidebend", name:"Dumbbell Side Bend", type:'lift', group:"Core", eq:"dumbbell", k:"oblique"},
  {id:"landminetwist", name:"Landmine Rotation", type:'lift', group:"Core", eq:"landmine", k:"twist"},
  {id:"medballslam", name:"Medicine Ball Slam", type:'lift', group:"Core", eq:"other"},
  {id:"medballtwist", name:"Medicine Ball Rotational Throw", type:'lift', group:"Core", eq:"other"},
  {id:"stirpot", name:"Stir the Pot", type:'lift', group:"Core", eq:"other", time:true, k:"stability ball"},
  {id:"kbwindmill", name:"Kettlebell Windmill", type:'lift', group:"Core", eq:"kettlebell", k:"kb"},
  {id:"overheadcarry", name:"Overhead Carry", type:'lift', group:"Core", eq:"dumbbell", time:true, k:"waiter walk"},
  {id:"frontrackcarry", name:"Front Rack Carry", type:'lift', group:"Core", eq:"kettlebell", time:true, k:"kb"},
  {id:"trapbarcarry", name:"Trap Bar Carry", type:'lift', group:"Core", eq:"trap bar", time:true, k:"farmer"},
  {id:"sandbagcarry", name:"Sandbag Carry", type:'lift', group:"Core", eq:"other", time:true, k:"bear hug"},
  {id:"yoke", name:"Yoke Walk", type:'lift', group:"Core", eq:"other", time:true, k:"strongman"},
  {id:"declinecrunch", name:"Decline Crunch", type:'lift', group:"Core", eq:"bodyweight", bw:true},
  {id:"weightedsitup", name:"Weighted Sit-up", type:'lift', group:"Core", eq:"bodyweight", bw:true, k:"plate"},
  {id:"abmachine", name:"Ab Rotation Machine", type:'lift', group:"Core", eq:"machine", k:"torso twist"},
  {id:"cleanpull", name:"Clean Pull", type:'lift', group:"Full body", eq:"barbell", bar:true, k:"olympic"},
  {id:"powersnatch", name:"Power Snatch", type:'lift', group:"Full body", eq:"barbell", bar:true, k:"olympic"},
  {id:"hangsnatch", name:"Hang Snatch", type:'lift', group:"Full body", eq:"barbell", bar:true, k:"olympic"},
  {id:"splitjerk", name:"Split Jerk", type:'lift', group:"Full body", eq:"barbell", bar:true, k:"olympic"},
  {id:"pushjerk", name:"Push Jerk", type:'lift', group:"Full body", eq:"barbell", bar:true, k:"olympic"},
  {id:"bbcomplex", name:"Barbell Complex", type:'lift', group:"Full body", eq:"barbell", bar:true},
  {id:"dbthruster", name:"Dumbbell Thruster", type:'lift', group:"Full body", eq:"dumbbell", k:"db"},
  {id:"dbsnatch", name:"Dumbbell Snatch", type:'lift', group:"Full body", eq:"dumbbell", k:"db"},
  {id:"dbclean", name:"Dumbbell Clean", type:'lift', group:"Full body", eq:"dumbbell", k:"db"},
  {id:"manmaker", name:"Man Maker", type:'lift', group:"Full body", eq:"dumbbell", k:"db burpee"},
  {id:"devilpress", name:"Devil Press", type:'lift', group:"Full body", eq:"dumbbell", k:"db burpee snatch"},
  {id:"kbsnatch", name:"Kettlebell Snatch", type:'lift', group:"Full body", eq:"kettlebell", k:"kb"},
  {id:"kbclean", name:"Kettlebell Clean", type:'lift', group:"Full body", eq:"kettlebell", k:"kb"},
  {id:"kbthruster", name:"Kettlebell Thruster", type:'lift', group:"Full body", eq:"kettlebell", k:"kb"},
  {id:"sandbagclean", name:"Sandbag Clean", type:'lift', group:"Full body", eq:"other", k:"strongman"},
  {id:"sandbagsquat", name:"Sandbag Squat", type:'lift', group:"Full body", eq:"other", k:"bear hug"},
  {id:"tireflip", name:"Tire Flip", type:'lift', group:"Full body", eq:"other", k:"strongman"},
  {id:"atlasstone", name:"Atlas Stone", type:'lift', group:"Full body", eq:"other", k:"strongman"},
  {id:"logpress", name:"Log Press", type:'lift', group:"Full body", eq:"other", k:"strongman"},
  {id:"ropeclimb", name:"Rope Climb", type:'lift', group:"Full body", eq:"bodyweight", bw:true},
  {id:"bearcrawl", name:"Bear Crawl", type:'lift', group:"Full body", eq:"bodyweight", bw:true, time:true},
  {id:"burpeebox", name:"Burpee Box Jump", type:'lift', group:"Full body", eq:"bodyweight", bw:true},
  {id:"sledpull", name:"Sled Pull", type:'lift', group:"Full body", eq:"sled", k:"rope"},
  {id:"kbswing2", name:"Double Kettlebell Swing", type:'lift', group:"Full body", eq:"kettlebell", k:"kb"},
  {id:"medballclean", name:"Medicine Ball Clean", type:'lift', group:"Full body", eq:"other"},
  {id:"tmwalk", name:"Treadmill Walk", type:'cardio', group:'Cardio', eq:"treadmill", k:"flat walk"},
  {id:"trailrun", name:"Trail Run", type:'cardio', group:'Cardio', eq:"outdoors", k:"trail"},
  {id:"ruck", name:"Ruck", type:'cardio', group:'Cardio', eq:"outdoors", k:"weighted walk rucking backpack vest"},
  {id:"tmruck", name:"Treadmill Ruck", type:'cardio', group:'Cardio', eq:"treadmill", k:"weighted walk rucking backpack vest incline"},
  {id:"stepmill", name:"Step Mill", type:'cardio', group:'Cardio', eq:"machine", k:"stairmaster stairs"},
  {id:"stepper", name:"Stepper", type:'cardio', group:'Cardio', eq:"machine", k:"mini stepper"},
  {id:"versaclimber", name:"VersaClimber", type:'cardio', group:'Cardio', eq:"machine", k:"climber"},
  {id:"arctrainer", name:"Arc Trainer", type:'cardio', group:'Cardio', eq:"machine", k:"elliptical"},
  {id:"spinbike", name:"Spin Bike", type:'cardio', group:'Cardio', eq:"bike", k:"spin class indoor cycling peloton"},
  {id:"recumbent", name:"Recumbent Bike", type:'cardio', group:'Cardio', eq:"bike", k:"seated bike"},
  {id:"roadbike", name:"Road Cycling", type:'cardio', group:'Cardio', eq:"bike", k:"outdoor bike ride"},
  {id:"mtb", name:"Mountain Biking", type:'cardio', group:'Cardio', eq:"bike", k:"trail bike"},
  {id:"openswim", name:"Open Water Swim", type:'cardio', group:'Cardio', eq:"pool", k:"lake ocean swim"},
  {id:"kayak", name:"Kayak", type:'cardio', group:'Cardio', eq:"water", k:"canoe paddle"},
  {id:"paddleboard", name:"Paddleboard", type:'cardio', group:'Cardio', eq:"water", k:"sup stand up paddle"},
  {id:"rollerblade", name:"Inline Skating", type:'cardio', group:'Cardio', eq:"other", k:"rollerblade skate"},
  {id:"xcski", name:"Cross-Country Ski", type:'cardio', group:'Cardio', eq:"other", k:"nordic ski"},
  {id:"snowshoe", name:"Snowshoe", type:'cardio', group:'Cardio', eq:"other", k:"snow"},
  {id:"hiit", name:"HIIT Class", type:'cardio', group:'Cardio', eq:"other", k:"high intensity interval bootcamp"},
  {id:"circuit", name:"Circuit Training", type:'cardio', group:'Cardio', eq:"other", k:"metcon"},
  {id:"boxing", name:"Boxing", type:'cardio', group:'Cardio', eq:"other", k:"heavy bag"},
  {id:"kickboxing", name:"Kickboxing", type:'cardio', group:'Cardio', eq:"other", k:"muay thai"},
  {id:"martialarts", name:"Martial Arts", type:'cardio', group:'Cardio', eq:"other", k:"bjj jiu jitsu karate wrestling"},
  {id:"basketball", name:"Basketball", type:'cardio', group:'Cardio', eq:"sport", k:"hoops"},
  {id:"soccer", name:"Soccer", type:'cardio', group:'Cardio', eq:"sport", k:"football"},
  {id:"tennis", name:"Tennis", type:'cardio', group:'Cardio', eq:"sport"},
  {id:"pickleball", name:"Pickleball", type:'cardio', group:'Cardio', eq:"sport"},
  {id:"volleyball", name:"Volleyball", type:'cardio', group:'Cardio', eq:"sport"},
  {id:"hockey", name:"Hockey", type:'cardio', group:'Cardio', eq:"sport", k:"ice"},
  {id:"golfwalk", name:"Golf (walking)", type:'cardio', group:'Cardio', eq:"sport"},
  {id:"climbing", name:"Rock Climbing", type:'cardio', group:'Cardio', eq:"other", k:"bouldering"},
  {id:"jumpingjacks", name:"Jumping Jacks", type:'cardio', group:'Cardio', eq:"other"},
  {id:"yoga", name:"Yoga", type:'cardio', group:'Cardio', eq:"other"},
  {id:"pilates", name:"Pilates", type:'cardio', group:'Cardio', eq:"other"},
  {id:"mobility", name:"Mobility", type:'cardio', group:'Cardio', eq:"other", k:"stretching stretch"},
  {id:"dance", name:"Dance", type:'cardio', group:'Cardio', eq:"other", k:"zumba"},
  {id:"sleddrag", name:"Sled Drag", type:'cardio', group:'Cardio', eq:"sled", k:"backwards reverse"},
  // ---- library expansion 2: machines, landmine, cable, Smith, kettlebell, band, bodyweight, strongman, sports ----
  // Chest
  {id:"smithcg", name:"Smith Machine Close-Grip Press", type:'lift', group:"Chest", eq:"smith", k:"triceps"},
  {id:"ngdbbench", name:"Neutral-Grip Dumbbell Press", type:'lift', group:"Chest", eq:"dumbbell", k:"hammer grip palms facing"},
  {id:"revgripdb", name:"Reverse-Grip Dumbbell Press", type:'lift', group:"Chest", eq:"dumbbell", k:"underhand upper chest"},
  {id:"altdbbench", name:"Alternating Dumbbell Press", type:'lift', group:"Chest", eq:"dumbbell", k:"one arm at a time"},
  {id:"incsqueeze", name:"Incline Squeeze Press", type:'lift', group:"Chest", eq:"dumbbell", k:"hex press"},
  {id:"larsen", name:"Larsen Press", type:'lift', group:"Chest", eq:"barbell", bar:true, k:"feet up bench press legs off floor"},
  {id:"pinpress", name:"Pin Press", type:'lift', group:"Chest", eq:"barbell", bar:true, k:"dead bench rack press"},
  {id:"slingshot", name:"Slingshot Bench Press", type:'lift', group:"Chest", eq:"barbell", bar:true, k:"overload"},
  {id:"tempobench", name:"Tempo Bench Press", type:'lift', group:"Chest", eq:"barbell", bar:true, k:"slow eccentric"},
  {id:"inccable", name:"Incline Cable Fly", type:'lift', group:"Chest", eq:"cable", k:"bench upper chest"},
  {id:"deccable", name:"Decline Cable Fly", type:'lift', group:"Chest", eq:"cable", k:"bench lower chest"},
  {id:"seatedcablefly", name:"Seated Cable Fly", type:'lift', group:"Chest", eq:"cable", k:"crossover machine"},
  {id:"sacablepress", name:"Single-Arm Cable Press", type:'lift', group:"Chest", eq:"cable", k:"standing one arm"},
  {id:"cablecrossover", name:"Cable Crossover", type:'lift', group:"Chest", eq:"cable", k:"high to low crossover fly"},
  {id:"lmchestpress", name:"Landmine Chest Press", type:'lift', group:"Chest", eq:"landmine", k:"single arm standing press"},
  {id:"lmsqueeze", name:"Landmine Squeeze Press", type:'lift', group:"Chest", eq:"landmine", k:"two hand chest press"},
  {id:"hsdec", name:"Hammer Strength Decline Press", type:'lift', group:"Chest", eq:"machine", k:"plate loaded iso lateral"},
  {id:"hswide", name:"Hammer Strength Wide Chest Press", type:'lift', group:"Chest", eq:"machine", k:"plate loaded iso lateral"},
  {id:"convergingpress", name:"Converging Chest Press", type:'lift', group:"Chest", eq:"machine", k:"arc machine press"},
  {id:"machpullover", name:"Machine Pullover", type:'lift', group:"Chest", eq:"machine", k:"nautilus lats"},
  {id:"smithfloor", name:"Smith Machine Floor Press", type:'lift', group:"Chest", eq:"smith", k:"lockout"},
  {id:"bandchestpress", name:"Band Chest Press", type:'lift', group:"Chest", eq:"band", k:"resistance band standing"},
  {id:"bandfly", name:"Band Fly", type:'lift', group:"Chest", eq:"band", k:"resistance band"},
  {id:"widepushup", name:"Wide Push-up", type:'lift', group:"Chest", eq:"bodyweight", bw:true},
  {id:"clappushup", name:"Clap Push-up", type:'lift', group:"Chest", eq:"bodyweight", bw:true, k:"plyometric explosive"},
  {id:"spiderpushup", name:"Spiderman Push-up", type:'lift', group:"Chest", eq:"bodyweight", bw:true, k:"knee to elbow"},
  {id:"pseudoplanche", name:"Pseudo Planche Push-up", type:'lift', group:"Chest", eq:"bodyweight", bw:true, k:"lean forward calisthenics"},
  {id:"kneepushup", name:"Knee Push-up", type:'lift', group:"Chest", eq:"bodyweight", bw:true, k:"modified beginner"},
  {id:"paralettepushup", name:"Parallette Push-up", type:'lift', group:"Chest", eq:"bodyweight", bw:true, k:"deep"},
  {id:"chestdip", name:"Chest Dip", type:'lift', group:"Chest", eq:"bodyweight", bw:true, k:"forward lean"},
  {id:"kbfloorpress", name:"Kettlebell Floor Press", type:'lift', group:"Chest", eq:"kettlebell"},
  {id:"standingdbfly", name:"Standing Dumbbell Fly", type:'lift', group:"Chest", eq:"dumbbell", k:"upward fly"},
  {id:"plateloadedfly", name:"Plate-Loaded Fly", type:'lift', group:"Chest", eq:"machine", k:"hammer strength pec fly"},
  {id:"deficitdbpress", name:"Deficit Dumbbell Press", type:'lift', group:"Chest", eq:"dumbbell", k:"deep stretch"},
  // Shoulders
  {id:"hsohp", name:"Hammer Strength Shoulder Press", type:'lift', group:"Shoulders", eq:"machine", k:"plate loaded iso lateral"},
  {id:"smithbtn", name:"Smith Machine Behind-the-Neck Press", type:'lift', group:"Shoulders", eq:"smith"},
  {id:"ngdbohp", name:"Neutral-Grip Dumbbell Shoulder Press", type:'lift', group:"Shoulders", eq:"dumbbell", k:"palms facing"},
  {id:"altdbohp", name:"Alternating Dumbbell Shoulder Press", type:'lift', group:"Shoulders", eq:"dumbbell", k:"one arm at a time"},
  {id:"halfkneellm", name:"Half-Kneeling Landmine Press", type:'lift', group:"Shoulders", eq:"landmine", k:"single arm"},
  {id:"lmpushpress", name:"Landmine Push Press", type:'lift', group:"Shoulders", eq:"landmine"},
  {id:"lmlateral", name:"Landmine Lateral Raise", type:'lift', group:"Shoulders", eq:"landmine", k:"side delt"},
  {id:"lmfront", name:"Landmine Front Raise", type:'lift', group:"Shoulders", eq:"landmine", k:"two hand"},
  {id:"lmreardelt", name:"Landmine Rear Delt Row", type:'lift', group:"Shoulders", eq:"landmine", k:"chest supported"},
  {id:"lyinglateral", name:"Lying Lateral Raise", type:'lift', group:"Shoulders", eq:"dumbbell", k:"incline side delt"},
  {id:"luraise", name:"Lu Raise", type:'lift', group:"Shoulders", eq:"dumbbell", k:"lateral raise to overhead"},
  {id:"powell", name:"Powell Raise", type:'lift', group:"Shoulders", eq:"dumbbell", k:"rear delt side lying"},
  {id:"dbreardeltrow", name:"Dumbbell Rear Delt Row", type:'lift', group:"Shoulders", eq:"dumbbell", k:"elbows out"},
  {id:"cableyraise", name:"Cable Y-Raise", type:'lift', group:"Shoulders", eq:"cable", k:"rope shoulder"},
  {id:"cablereardeltrow", name:"Cable Rear Delt Row", type:'lift', group:"Shoulders", eq:"cable", k:"rope elbows high"},
  {id:"behindbacklateral", name:"Behind-the-Back Cable Lateral Raise", type:'lift', group:"Shoulders", eq:"cable", k:"side delt"},
  {id:"kneelfacepull", name:"Kneeling Face Pull", type:'lift', group:"Shoulders", eq:"cable", k:"rope rear delt"},
  {id:"hsreardelt", name:"Machine Rear Delt Fly", type:'lift', group:"Shoulders", eq:"machine", k:"rear delt machine reverse fly hammer strength"},
  {id:"machfrontraise", name:"Machine Front Raise", type:'lift', group:"Shoulders", eq:"machine"},
  {id:"bandlateral", name:"Band Lateral Raise", type:'lift', group:"Shoulders", eq:"band", k:"resistance band"},
  {id:"bandfacepull", name:"Band Face Pull", type:'lift', group:"Shoulders", eq:"band", k:"resistance band rear delt"},
  {id:"bandohp", name:"Band Overhead Press", type:'lift', group:"Shoulders", eq:"band", k:"resistance band"},
  {id:"bandfrontraise", name:"Band Front Raise", type:'lift', group:"Shoulders", eq:"band", k:"resistance band"},
  {id:"bottomsup", name:"Bottoms-Up Kettlebell Press", type:'lift', group:"Shoulders", eq:"kettlebell", k:"stability"},
  {id:"dblkbpress", name:"Double Kettlebell Press", type:'lift', group:"Shoulders", eq:"kettlebell", k:"two bells"},
  {id:"seesaw", name:"Seesaw Press", type:'lift', group:"Shoulders", eq:"kettlebell", k:"alternating kettlebell dumbbell"},
  {id:"kbhalo", name:"Kettlebell Halo", type:'lift', group:"Shoulders", eq:"kettlebell", k:"mobility warm-up"},
  {id:"busdriver", name:"Bus Driver", type:'lift', group:"Shoulders", eq:"other", k:"plate rotation front delt"},
  {id:"btbshrug", name:"Behind-the-Back Barbell Shrug", type:'lift', group:"Shoulders", eq:"barbell", bar:true, k:"traps"},
  {id:"ohshrug", name:"Overhead Shrug", type:'lift', group:"Shoulders", eq:"barbell", bar:true, k:"snatch grip traps"},
  {id:"kelso", name:"Kelso Shrug", type:'lift', group:"Shoulders", eq:"barbell", bar:true, k:"chest supported mid traps"},
  {id:"dbfarmershrug", name:"Farmer Shrug", type:'lift', group:"Shoulders", eq:"dumbbell", k:"heavy dumbbell shrug"},
  {id:"machshrug", name:"Shrug Machine", type:'lift', group:"Shoulders", eq:"machine", k:"plate loaded standing shrug"},
  {id:"wallhandstand", name:"Wall Handstand Hold", type:'lift', group:"Shoulders", eq:"bodyweight", bw:true, time:true, k:"balance"},
  {id:"wallwalk", name:"Wall Walk", type:'lift', group:"Shoulders", eq:"bodyweight", bw:true, k:"crossfit"},
  {id:"platepress", name:"Plate Overhead Press", type:'lift', group:"Shoulders", eq:"other", k:"two hand"},
  {id:"csreardelt", name:"Chest-Supported Rear Delt Fly", type:'lift', group:"Shoulders", eq:"dumbbell", k:"incline bench prone"},
  {id:"scottpress", name:"Scott Press", type:'lift', group:"Shoulders", eq:"dumbbell", k:"side delt press"},
  {id:"bandupright", name:"Band Upright Row", type:'lift', group:"Shoulders", eq:"band", k:"resistance band"},
  // Back
  {id:"negpullup", name:"Negative Pull-up", type:'lift', group:"Back", eq:"bodyweight", bw:true, k:"eccentric slow lowering"},
  {id:"jumppullup", name:"Jumping Pull-up", type:'lift', group:"Back", eq:"bodyweight", bw:true, k:"assisted"},
  {id:"kippullup", name:"Kipping Pull-up", type:'lift', group:"Back", eq:"bodyweight", bw:true, k:"crossfit"},
  {id:"butterflypullup", name:"Butterfly Pull-up", type:'lift', group:"Back", eq:"bodyweight", bw:true, k:"crossfit"},
  {id:"c2bpullup", name:"Chest-to-Bar Pull-up", type:'lift', group:"Back", eq:"bodyweight", bw:true, k:"crossfit"},
  {id:"archerpullup", name:"Archer Pull-up", type:'lift', group:"Back", eq:"bodyweight", bw:true, k:"one arm progression"},
  {id:"lsitpullup", name:"L-Sit Pull-up", type:'lift', group:"Back", eq:"bodyweight", bw:true, k:"core"},
  {id:"commandopullup", name:"Commando Pull-up", type:'lift', group:"Back", eq:"bodyweight", bw:true, k:"mixed grip"},
  {id:"ringpullup", name:"Ring Pull-up", type:'lift', group:"Back", eq:"bodyweight", bw:true, k:"gymnastic rings"},
  {id:"towelpullup", name:"Towel Pull-up", type:'lift', group:"Back", eq:"bodyweight", bw:true, k:"grip"},
  {id:"typewriter", name:"Typewriter Pull-up", type:'lift', group:"Back", eq:"bodyweight", bw:true, k:"side to side"},
  {id:"revgrippulldown", name:"Reverse-Grip Pulldown", type:'lift', group:"Back", eq:"cable", k:"underhand supinated"},
  {id:"btnpulldown", name:"Behind-the-Neck Pulldown", type:'lift', group:"Back", eq:"cable"},
  {id:"ropepulldown", name:"Rope Pulldown", type:'lift', group:"Back", eq:"cable", k:"neutral"},
  {id:"kneelpulldown", name:"Kneeling Cable Pulldown", type:'lift', group:"Back", eq:"cable", k:"straight bar"},
  {id:"ropesapulldown", name:"Rope Straight-Arm Pulldown", type:'lift', group:"Back", eq:"cable", k:"lat prayer"},
  {id:"latprayer", name:"Lat Prayer", type:'lift', group:"Back", eq:"cable", k:"kneeling rope pullover"},
  {id:"hspulldown", name:"Hammer Strength Pulldown", type:'lift', group:"Back", eq:"machine", k:"plate loaded iso lateral"},
  {id:"hslowrow", name:"Hammer Strength Low Row", type:'lift', group:"Back", eq:"machine", k:"plate loaded iso lateral"},
  {id:"hsfrontpulldown", name:"Iso-Lateral Front Pulldown", type:'lift', group:"Back", eq:"machine", k:"hammer strength"},
  {id:"cstbar", name:"Chest-Supported T-Bar Row", type:'lift', group:"Back", eq:"machine", k:"plate loaded"},
  {id:"machlowrow", name:"Machine Low Row", type:'lift', group:"Back", eq:"machine", k:"seated plate loaded"},
  {id:"helms", name:"Helms Row", type:'lift', group:"Back", eq:"dumbbell", k:"chest supported on bench"},
  {id:"bentdbrow", name:"Bent-Over Dumbbell Row", type:'lift', group:"Back", eq:"dumbbell", k:"two arm"},
  {id:"kbrow", name:"Kettlebell Row", type:'lift', group:"Back", eq:"kettlebell", k:"single arm"},
  {id:"gorillarow", name:"Gorilla Row", type:'lift', group:"Back", eq:"kettlebell", k:"alternating two bells"},
  {id:"renegaderow", name:"Renegade Row", type:'lift', group:"Back", eq:"dumbbell", k:"plank row core"},
  {id:"trapbarrow", name:"Trap Bar Row", type:'lift', group:"Back", eq:"trap bar", bar:true, k:"hex bar"},
  {id:"standingcablerow", name:"Standing Cable Row", type:'lift', group:"Back", eq:"cable", k:"rope"},
  {id:"sasapulldown", name:"Single-Arm Straight-Arm Pulldown", type:'lift', group:"Back", eq:"cable", k:"lat"},
  {id:"highrowcable", name:"High Cable Row", type:'lift', group:"Back", eq:"cable", k:"rope face level"},
  {id:"lmsarow", name:"Landmine Single-Arm Row", type:'lift', group:"Back", eq:"landmine", k:"one arm"},
  {id:"lmtbar", name:"Landmine T-Bar Row", type:'lift', group:"Back", eq:"landmine", k:"v handle"},
  {id:"jeffersondl", name:"Jefferson Deadlift", type:'lift', group:"Back", eq:"barbell", bar:true, k:"straddle"},
  {id:"dbdeadlift", name:"Dumbbell Deadlift", type:'lift', group:"Back", eq:"dumbbell", k:"two dumbbells"},
  {id:"suitcasedl", name:"Suitcase Deadlift", type:'lift', group:"Back", eq:"dumbbell", k:"one side kettlebell"},
  {id:"kbsumo", name:"Kettlebell Sumo Deadlift", type:'lift', group:"Back", eq:"kettlebell"},
  {id:"ghdbackext", name:"GHD Back Extension", type:'lift', group:"Back", eq:"bodyweight", bw:true, k:"glute ham developer"},
  {id:"ghdhipext", name:"GHD Hip Extension", type:'lift', group:"Back", eq:"bodyweight", bw:true, k:"glute ham developer"},
  {id:"bandrow", name:"Band Row", type:'lift', group:"Back", eq:"band", k:"resistance band"},
  {id:"bandpulldown", name:"Band Pulldown", type:'lift', group:"Back", eq:"band", k:"resistance band"},
  {id:"bandsapulldown", name:"Band Straight-Arm Pulldown", type:'lift', group:"Back", eq:"band", k:"resistance band"},
  {id:"trxpullup", name:"TRX Pull-up", type:'lift', group:"Back", eq:"bodyweight", bw:true, k:"suspension"},
  {id:"feetelevrow", name:"Feet-Elevated Inverted Row", type:'lift', group:"Back", eq:"bodyweight", bw:true, k:"harder"},
  {id:"rackchin", name:"Rack Chin", type:'lift', group:"Back", eq:"bodyweight", bw:true, k:"feet on bench"},
  {id:"shotgunrow", name:"Shotgun Row", type:'lift', group:"Back", eq:"cable", k:"single arm rotation"},
  {id:"assistngpullup", name:"Assisted Neutral-Grip Pull-up", type:'lift', group:"Back", eq:"machine", k:"counterweight"},
  {id:"smithinvrow", name:"Smith Machine Inverted Row", type:'lift', group:"Back", eq:"smith", bw:true, k:"bodyweight row"},
  {id:"deadstoprow", name:"Dead-Stop Dumbbell Row", type:'lift', group:"Back", eq:"dumbbell", k:"from floor"},
  {id:"wgsealrow", name:"Wide-Grip Seal Row", type:'lift', group:"Back", eq:"barbell", bar:true, k:"chest supported"},
  {id:"romanchair", name:"Roman Chair Back Extension", type:'lift', group:"Back", eq:"bodyweight", bw:true, k:"horizontal"},
  // Arms
  {id:"sacablecurl", name:"Single-Arm Cable Curl", type:'lift', group:"Arms", eq:"cable"},
  {id:"lyingcablecurl", name:"Lying Cable Curl", type:'lift', group:"Arms", eq:"cable", k:"bench"},
  {id:"cablepreacher", name:"Cable Preacher Curl", type:'lift', group:"Arms", eq:"cable"},
  {id:"cablehammersa", name:"Single-Arm Rope Hammer Curl", type:'lift', group:"Arms", eq:"cable"},
  {id:"seateddbcurl", name:"Seated Dumbbell Curl", type:'lift', group:"Arms", eq:"dumbbell"},
  {id:"waiter", name:"Waiter Curl", type:'lift', group:"Arms", eq:"dumbbell", k:"one dumbbell both hands"},
  {id:"revdbcurl", name:"Reverse Dumbbell Curl", type:'lift', group:"Arms", eq:"dumbbell", k:"pronated forearm"},
  {id:"dbdragcurl", name:"Dumbbell Drag Curl", type:'lift', group:"Arms", eq:"dumbbell"},
  {id:"preacherhammer", name:"Preacher Hammer Curl", type:'lift', group:"Arms", eq:"dumbbell"},
  {id:"inchammer", name:"Incline Hammer Curl", type:'lift', group:"Arms", eq:"dumbbell"},
  {id:"curl21", name:"Barbell 21s", type:'lift', group:"Arms", eq:"barbell", bar:true, k:"partials 21 reps"},
  {id:"strictcurl", name:"Strict Curl", type:'lift', group:"Arms", eq:"barbell", bar:true, k:"against wall"},
  {id:"cgezcurl", name:"Close-Grip EZ-Bar Curl", type:'lift', group:"Arms", eq:"EZ bar", bar:true},
  {id:"ezpreacherrev", name:"Reverse Preacher Curl", type:'lift', group:"Arms", eq:"EZ bar", bar:true, k:"pronated"},
  {id:"spiderez", name:"EZ-Bar Spider Curl", type:'lift', group:"Arms", eq:"EZ bar", bar:true, k:"incline prone"},
  {id:"machhammer", name:"Machine Hammer Curl", type:'lift', group:"Arms", eq:"machine", k:"neutral grip"},
  {id:"kbcurl", name:"Kettlebell Curl", type:'lift', group:"Arms", eq:"kettlebell"},
  {id:"bandhammer", name:"Band Hammer Curl", type:'lift', group:"Arms", eq:"band", k:"resistance band"},
  {id:"trxcurl", name:"TRX Biceps Curl", type:'lift', group:"Arms", eq:"bodyweight", bw:true, k:"suspension"},
  {id:"chinupbiceps", name:"Close-Grip Chin-up", type:'lift', group:"Arms", eq:"bodyweight", bw:true, k:"biceps"},
  {id:"ropeoh", name:"Rope Overhead Extension", type:'lift', group:"Arms", eq:"cable", k:"triceps"},
  {id:"cablelyingext", name:"Cable Lying Triceps Extension", type:'lift', group:"Arms", eq:"cable", k:"skull crusher"},
  {id:"crossbodyext", name:"Cross-Body Cable Extension", type:'lift', group:"Arms", eq:"cable", k:"single arm triceps"},
  {id:"cablekickbackrope", name:"Rope Kickback", type:'lift', group:"Arms", eq:"cable", k:"triceps"},
  {id:"bbskull", name:"Barbell Skull Crusher", type:'lift', group:"Arms", eq:"barbell", bar:true, k:"lying triceps extension"},
  {id:"incskull", name:"Incline Skull Crusher", type:'lift', group:"Arms", eq:"EZ bar", bar:true, k:"long head"},
  {id:"decskull", name:"Decline Skull Crusher", type:'lift', group:"Arms", eq:"EZ bar", bar:true},
  {id:"bbohext", name:"Barbell Overhead Extension", type:'lift', group:"Arms", eq:"barbell", bar:true, k:"french press"},
  {id:"seatedohtri", name:"Seated Overhead Triceps Extension", type:'lift', group:"Arms", eq:"dumbbell", k:"two hand"},
  {id:"bwskull", name:"Bodyweight Skull Crusher", type:'lift', group:"Arms", eq:"bodyweight", bw:true, k:"bar triceps extension"},
  {id:"bandohtri", name:"Band Overhead Extension", type:'lift', group:"Arms", eq:"band", k:"resistance band triceps"},
  {id:"bandtrikick", name:"Band Triceps Kickback", type:'lift', group:"Arms", eq:"band", k:"resistance band triceps"},
  {id:"trxtri", name:"TRX Triceps Extension", type:'lift', group:"Arms", eq:"bodyweight", bw:true, k:"suspension"},
  {id:"seateddipmach", name:"Seated Dip Machine", type:'lift', group:"Arms", eq:"machine", k:"triceps press down"},
  {id:"dbfloorskull", name:"Dumbbell Floor Skull Crusher", type:'lift', group:"Arms", eq:"dumbbell", k:"triceps"},
  {id:"btbwristcurl", name:"Behind-the-Back Wrist Curl", type:'lift', group:"Arms", eq:"barbell", bar:true, k:"forearms"},
  {id:"fingercurl", name:"Finger Curl", type:'lift', group:"Arms", eq:"barbell", bar:true, k:"grip forearms"},
  {id:"cablewristcurl", name:"Cable Wrist Curl", type:'lift', group:"Arms", eq:"cable", k:"forearms"},
  {id:"towelhang", name:"Towel Dead Hang", type:'lift', group:"Arms", eq:"bodyweight", bw:true, time:true, k:"grip"},
  {id:"fatgripcurl", name:"Fat Grip Curl", type:'lift', group:"Arms", eq:"dumbbell", k:"forearms"},
  {id:"farmerhold", name:"Farmer's Hold", type:'lift', group:"Arms", eq:"dumbbell", time:true, k:"grip static hold"},
  {id:"platewristcurl", name:"Plate Wrist Curl", type:'lift', group:"Arms", eq:"other", k:"forearms"},
  // Legs
  {id:"revhack", name:"Reverse Hack Squat", type:'lift', group:"Legs", eq:"machine", k:"facing pad glutes"},
  {id:"hackcalf", name:"Hack Squat Calf Raise", type:'lift', group:"Legs", eq:"machine", k:"calf press"},
  {id:"sissymachine", name:"Sissy Squat Machine", type:'lift', group:"Legs", eq:"machine", bw:true, k:"quads"},
  {id:"smithfront", name:"Smith Machine Front Squat", type:'lift', group:"Legs", eq:"smith"},
  {id:"smithsplit", name:"Smith Machine Split Squat", type:'lift', group:"Legs", eq:"smith", k:"bulgarian"},
  {id:"smithhip", name:"Smith Machine Hip Thrust", type:'lift', group:"Legs", eq:"smith", k:"glutes"},
  {id:"smithgm", name:"Smith Machine Good Morning", type:'lift', group:"Legs", eq:"smith", k:"hamstrings"},
  {id:"smithsumo", name:"Smith Machine Sumo Squat", type:'lift', group:"Legs", eq:"smith", k:"wide stance"},
  {id:"smithstepup", name:"Smith Machine Step-up", type:'lift', group:"Legs", eq:"smith"},
  {id:"legpresswide", name:"Wide-Stance Leg Press", type:'lift', group:"Legs", eq:"machine", k:"adductors glutes"},
  {id:"legpressnarrow", name:"Narrow-Stance Leg Press", type:'lift', group:"Legs", eq:"machine", k:"quads"},
  {id:"legpresshigh", name:"High-Foot Leg Press", type:'lift', group:"Legs", eq:"machine", k:"glutes hamstrings"},
  {id:"hslegpress", name:"Hammer Strength Leg Press", type:'lift', group:"Legs", eq:"machine", k:"plate loaded iso lateral"},
  {id:"lyinglegpress", name:"Lying Leg Press", type:'lift', group:"Legs", eq:"machine", k:"vertical"},
  {id:"kneelinglegcurl", name:"Kneeling Leg Curl", type:'lift', group:"Legs", eq:"machine", k:"single hamstring"},
  {id:"nordicmachine", name:"Nordic Curl Machine", type:'lift', group:"Legs", eq:"machine", bw:true, k:"hamstring"},
  {id:"ballcurl", name:"Swiss Ball Leg Curl", type:'lift', group:"Legs", eq:"bodyweight", bw:true, k:"stability ball hamstring"},
  {id:"slidercurl", name:"Slider Leg Curl", type:'lift', group:"Legs", eq:"bodyweight", bw:true, k:"hamstring"},
  {id:"bandedhipthrust", name:"Banded Hip Thrust", type:'lift', group:"Legs", eq:"band", k:"glutes"},
  {id:"bstancehip", name:"B-Stance Hip Thrust", type:'lift', group:"Legs", eq:"barbell", bar:true, k:"staggered single leg"},
  {id:"feetelevbridge", name:"Feet-Elevated Glute Bridge", type:'lift', group:"Legs", eq:"bodyweight", bw:true, k:"bench"},
  {id:"dbglutebridge", name:"Dumbbell Glute Bridge", type:'lift', group:"Legs", eq:"dumbbell"},
  {id:"kbhipthrust", name:"Kettlebell Hip Thrust", type:'lift', group:"Legs", eq:"kettlebell"},
  {id:"andersonsquat", name:"Anderson Squat", type:'lift', group:"Legs", eq:"barbell", bar:true, k:"from pins bottom up"},
  {id:"bbsplitsquat", name:"Barbell Split Squat", type:'lift', group:"Legs", eq:"barbell", bar:true},
  {id:"bbbss", name:"Barbell Bulgarian Split Squat", type:'lift', group:"Legs", eq:"barbell", bar:true, k:"rear foot elevated"},
  {id:"bbstepup", name:"Barbell Step-up", type:'lift', group:"Legs", eq:"barbell", bar:true},
  {id:"bbrevlunge", name:"Barbell Reverse Lunge", type:'lift', group:"Legs", eq:"barbell", bar:true},
  {id:"bbwalklunge", name:"Barbell Walking Lunge", type:'lift', group:"Legs", eq:"barbell", bar:true},
  {id:"bbhacksquat", name:"Barbell Hack Squat", type:'lift', group:"Legs", eq:"barbell", bar:true, k:"behind the back"},
  {id:"jeffersonsquat", name:"Jefferson Squat", type:'lift', group:"Legs", eq:"barbell", bar:true, k:"straddle"},
  {id:"snatchrdl", name:"Snatch-Grip Romanian Deadlift", type:'lift', group:"Legs", eq:"barbell", bar:true, k:"wide grip"},
  {id:"sumordl", name:"Sumo Romanian Deadlift", type:'lift', group:"Legs", eq:"barbell", bar:true, k:"wide stance"},
  {id:"bbcalf", name:"Barbell Calf Raise", type:'lift', group:"Legs", eq:"barbell", bar:true, k:"standing"},
  {id:"frontracklunge", name:"Front Rack Reverse Lunge", type:'lift', group:"Legs", eq:"barbell", bar:true, k:"front loaded"},
  {id:"ssbgm", name:"Safety Bar Good Morning", type:'lift', group:"Legs", eq:"barbell", bar:true, k:"ssb"},
  {id:"cossack", name:"Cossack Squat", type:'lift', group:"Legs", eq:"dumbbell", k:"lateral deep"},
  {id:"dbsldl", name:"Dumbbell Stiff-Leg Deadlift", type:'lift', group:"Legs", eq:"dumbbell", k:"hamstrings"},
  {id:"dbslcalf", name:"Single-Leg Dumbbell Calf Raise", type:'lift', group:"Legs", eq:"dumbbell"},
  {id:"dbjumpsquat", name:"Dumbbell Jump Squat", type:'lift', group:"Legs", eq:"dumbbell", k:"power"},
  {id:"dbfrontsquat", name:"Dumbbell Front Squat", type:'lift', group:"Legs", eq:"dumbbell", k:"front rack"},
  {id:"dbsidelunge", name:"Dumbbell Side Lunge", type:'lift', group:"Legs", eq:"dumbbell", k:"lateral"},
  {id:"ohwalklunge", name:"Overhead Walking Lunge", type:'lift', group:"Legs", eq:"dumbbell", k:"stability"},
  {id:"stepdown", name:"Step-down", type:'lift', group:"Legs", eq:"dumbbell", k:"eccentric knee"},
  {id:"kbstepup", name:"Kettlebell Step-up", type:'lift', group:"Legs", eq:"kettlebell"},
  {id:"dblkbfront", name:"Double Kettlebell Front Squat", type:'lift', group:"Legs", eq:"kettlebell", k:"two bells"},
  {id:"kbgoblet", name:"Kettlebell Goblet Squat", type:'lift', group:"Legs", eq:"kettlebell"},
  {id:"kbbss", name:"Kettlebell Bulgarian Split Squat", type:'lift', group:"Legs", eq:"kettlebell"},
  {id:"kbsldl", name:"Kettlebell Single-Leg Deadlift", type:'lift', group:"Legs", eq:"kettlebell", k:"balance"},
  {id:"kbcalf", name:"Kettlebell Calf Raise", type:'lift', group:"Legs", eq:"kettlebell"},
  {id:"lmrdl", name:"Landmine Romanian Deadlift", type:'lift', group:"Legs", eq:"landmine", k:"hamstrings"},
  {id:"lmrevlunge", name:"Landmine Reverse Lunge", type:'lift', group:"Legs", eq:"landmine"},
  {id:"lmlatlunge", name:"Landmine Lateral Lunge", type:'lift', group:"Legs", eq:"landmine", k:"side"},
  {id:"lmsplit", name:"Landmine Split Squat", type:'lift', group:"Legs", eq:"landmine", k:"bulgarian"},
  {id:"lmhack", name:"Landmine Hack Squat", type:'lift', group:"Legs", eq:"landmine", k:"quads"},
  {id:"lmsumo", name:"Landmine Sumo Squat", type:'lift', group:"Legs", eq:"landmine", k:"wide stance"},
  {id:"lmsldl", name:"Landmine Single-Leg Deadlift", type:'lift', group:"Legs", eq:"landmine", k:"balance"},
  {id:"lmcalf", name:"Landmine Calf Raise", type:'lift', group:"Legs", eq:"landmine"},
  {id:"lmthruster", name:"Landmine Thruster", type:'lift', group:"Legs", eq:"landmine", k:"squat to press"},
  {id:"lmgoodmorning", name:"Landmine Good Morning", type:'lift', group:"Legs", eq:"landmine", k:"hamstrings"},
  {id:"bwlunge", name:"Bodyweight Lunge", type:'lift', group:"Legs", eq:"bodyweight", bw:true, k:"walking reverse"},
  {id:"bwbss", name:"Bodyweight Bulgarian Split Squat", type:'lift', group:"Legs", eq:"bodyweight", bw:true, k:"rear foot elevated"},
  {id:"bwstepup", name:"Bodyweight Step-up", type:'lift', group:"Legs", eq:"bodyweight", bw:true},
  {id:"bwcossack", name:"Bodyweight Cossack Squat", type:'lift', group:"Legs", eq:"bodyweight", bw:true, k:"lateral mobility"},
  {id:"bwhipthrust", name:"Bodyweight Hip Thrust", type:'lift', group:"Legs", eq:"bodyweight", bw:true, k:"bench"},
  {id:"bwcalf", name:"Bodyweight Calf Raise", type:'lift', group:"Legs", eq:"bodyweight", bw:true, k:"standing"},
  {id:"donkeykick", name:"Donkey Kick", type:'lift', group:"Legs", eq:"bodyweight", bw:true, k:"glute quadruped"},
  {id:"firehydrant", name:"Fire Hydrant", type:'lift', group:"Legs", eq:"bodyweight", bw:true, k:"glute medius"},
  {id:"hindusquat", name:"Hindu Squat", type:'lift', group:"Legs", eq:"bodyweight", bw:true, k:"heels up"},
  {id:"tuckjump", name:"Tuck Jump", type:'lift', group:"Legs", eq:"bodyweight", bw:true, k:"plyometric"},
  {id:"depthjump", name:"Depth Jump", type:'lift', group:"Legs", eq:"bodyweight", bw:true, k:"plyometric box"},
  {id:"splitjump", name:"Split Jump", type:'lift', group:"Legs", eq:"bodyweight", bw:true, k:"plyometric lunge"},
  {id:"lateralbound", name:"Lateral Bound", type:'lift', group:"Legs", eq:"bodyweight", bw:true, k:"plyometric"},
  {id:"bandsquat", name:"Banded Squat", type:'lift', group:"Legs", eq:"band", k:"resistance band"},
  {id:"bandglutebridge", name:"Banded Glute Bridge", type:'lift', group:"Legs", eq:"band", k:"resistance band"},
  {id:"lateralbandwalk", name:"Lateral Band Walk", type:'lift', group:"Legs", eq:"band", k:"glute medius"},
  {id:"bandglutekick", name:"Band Glute Kickback", type:'lift', group:"Legs", eq:"band", k:"glute"},
  {id:"bandlegcurl", name:"Band Leg Curl", type:'lift', group:"Legs", eq:"band", k:"hamstring"},
  {id:"bandabduction", name:"Seated Band Abduction", type:'lift', group:"Legs", eq:"band", k:"glute medius"},
  {id:"revsleddrag", name:"Reverse Sled Drag", type:'lift', group:"Legs", eq:"sled", k:"backward walk knees quads"},
  {id:"sledlunge", name:"Sled Push Lunge", type:'lift', group:"Legs", eq:"sled"},
  {id:"beltsquatmarch", name:"Belt Squat March", type:'lift', group:"Legs", eq:"machine", k:"glute"},
  {id:"multihip", name:"Multi-Hip Machine", type:'lift', group:"Legs", eq:"machine", k:"hip flexion extension"},
  {id:"tibmachine", name:"Tibialis Machine", type:'lift', group:"Legs", eq:"machine", k:"shins"},
  {id:"slegpresscalf", name:"Single-Leg Calf Press", type:'lift', group:"Legs", eq:"machine", k:"leg press"},
  // Core
  {id:"standingcablecrunch", name:"Standing Cable Crunch", type:'lift', group:"Core", eq:"cable", k:"rope"},
  {id:"cablesidebend", name:"Cable Side Bend", type:'lift', group:"Core", eq:"cable", k:"obliques"},
  {id:"lowtohighchop", name:"Low-to-High Cable Chop", type:'lift', group:"Core", eq:"cable", k:"rotation"},
  {id:"cablereversecrunch", name:"Cable Reverse Crunch", type:'lift', group:"Core", eq:"cable", k:"ankle strap"},
  {id:"kneelingpallof", name:"Half-Kneeling Pallof Press", type:'lift', group:"Core", eq:"cable", k:"anti rotation"},
  {id:"lmrainbow", name:"Landmine Rainbow", type:'lift', group:"Core", eq:"landmine", k:"anti rotation arc"},
  {id:"lmantirot", name:"Landmine Anti-Rotation Press", type:'lift', group:"Core", eq:"landmine", k:"kneeling"},
  {id:"bbrollout", name:"Barbell Rollout", type:'lift', group:"Core", eq:"barbell", bar:true, k:"ab wheel"},
  {id:"standingabwheel", name:"Standing Ab Wheel", type:'lift', group:"Core", eq:"bodyweight", bw:true, k:"rollout"},
  {id:"plankshouldertap", name:"Plank Shoulder Tap", type:'lift', group:"Core", eq:"bodyweight", bw:true, k:"anti rotation"},
  {id:"sideplankdip", name:"Side Plank Hip Dip", type:'lift', group:"Core", eq:"bodyweight", bw:true, k:"obliques"},
  {id:"plankreach", name:"Plank Reach", type:'lift', group:"Core", eq:"bodyweight", bw:true, k:"stability"},
  {id:"scissorkick", name:"Scissor Kick", type:'lift', group:"Core", eq:"bodyweight", bw:true, k:"lower abs"},
  {id:"heeltouch", name:"Heel Touch", type:'lift', group:"Core", eq:"bodyweight", bw:true, k:"obliques"},
  {id:"windshield", name:"Windshield Wiper", type:'lift', group:"Core", eq:"bodyweight", bw:true, k:"hanging obliques"},
  {id:"lyingwindshield", name:"Lying Windshield Wiper", type:'lift', group:"Core", eq:"bodyweight", bw:true, k:"obliques"},
  {id:"sliderkneetuck", name:"Slider Knee Tuck", type:'lift', group:"Core", eq:"bodyweight", bw:true, k:"sliders pike"},
  {id:"trxpike", name:"TRX Pike", type:'lift', group:"Core", eq:"bodyweight", bw:true, k:"suspension"},
  {id:"trxfallout", name:"TRX Fallout", type:'lift', group:"Core", eq:"bodyweight", bw:true, k:"suspension anti extension"},
  {id:"trxkneetuck", name:"TRX Knee Tuck", type:'lift', group:"Core", eq:"bodyweight", bw:true, k:"suspension"},
  {id:"wtddeadbug", name:"Weighted Dead Bug", type:'lift', group:"Core", eq:"dumbbell", k:"plate"},
  {id:"dbwoodchop", name:"Dumbbell Woodchop", type:'lift', group:"Core", eq:"dumbbell", k:"rotation"},
  {id:"dbrussian", name:"Weighted Russian Twist", type:'lift', group:"Core", eq:"dumbbell", k:"plate"},
  {id:"kbaroundworld", name:"Kettlebell Around the World", type:'lift', group:"Core", eq:"kettlebell", k:"obliques"},
  {id:"waitercarry", name:"Waiter Carry", type:'lift', group:"Core", eq:"kettlebell", k:"overhead single"},
  {id:"zerchercarry", name:"Zercher Carry", type:'lift', group:"Core", eq:"barbell", bar:true, k:"elbows"},
  {id:"crossbodycarry", name:"Cross-Body Carry", type:'lift', group:"Core", eq:"kettlebell", k:"one overhead one suitcase"},
  {id:"medballvup", name:"Medicine Ball V-up", type:'lift', group:"Core", eq:"other"},
  {id:"medballrussian", name:"Medicine Ball Russian Twist", type:'lift', group:"Core", eq:"other"},
  {id:"ghdsitup", name:"GHD Sit-up", type:'lift', group:"Core", eq:"bodyweight", bw:true, k:"glute ham developer crossfit"},
  {id:"hangslraise", name:"Hanging Straight-Leg Raise", type:'lift', group:"Core", eq:"bodyweight", bw:true, k:"strict"},
  {id:"abcoaster", name:"Ab Coaster", type:'lift', group:"Core", eq:"machine", k:"kneeling crunch machine"},
  {id:"decoblique", name:"Decline Oblique Crunch", type:'lift', group:"Core", eq:"bodyweight", bw:true, k:"twist"},
  {id:"hangobliqueraise", name:"Hanging Oblique Knee Raise", type:'lift', group:"Core", eq:"bodyweight", bw:true, k:"twist"},
  {id:"birddogrow", name:"Bird Dog Row", type:'lift', group:"Core", eq:"dumbbell", k:"bench stability"},
  {id:"sandbaggetup", name:"Sandbag Get-up", type:'lift', group:"Core", eq:"other", k:"shoulder"},
  {id:"revbearcrawl", name:"Backward Bear Crawl", type:'lift', group:"Core", eq:"bodyweight", bw:true, k:"quadruped"},
  {id:"crabwalk", name:"Crab Walk", type:'lift', group:"Core", eq:"bodyweight", bw:true},
  {id:"inchworm", name:"Inchworm", type:'lift', group:"Core", eq:"bodyweight", bw:true, k:"warm-up"},
  // Full body
  {id:"cleanpress", name:"Clean and Press", type:'lift', group:"Full body", eq:"barbell", bar:true, k:"strict"},
  {id:"squatclean", name:"Squat Clean", type:'lift', group:"Full body", eq:"barbell", bar:true, k:"olympic full clean"},
  {id:"hangpowerclean", name:"Hang Power Clean", type:'lift', group:"Full body", eq:"barbell", bar:true, k:"olympic"},
  {id:"musclesnatch", name:"Muscle Snatch", type:'lift', group:"Full body", eq:"barbell", bar:true, k:"olympic"},
  {id:"snatchpull", name:"Snatch Pull", type:'lift', group:"Full body", eq:"barbell", bar:true, k:"olympic"},
  {id:"snatchbalance", name:"Snatch Balance", type:'lift', group:"Full body", eq:"barbell", bar:true, k:"olympic"},
  {id:"sotspress", name:"Sots Press", type:'lift', group:"Full body", eq:"barbell", bar:true, k:"overhead squat press"},
  {id:"sdhp", name:"Sumo Deadlift High Pull", type:'lift', group:"Full body", eq:"barbell", bar:true, k:"crossfit"},
  {id:"muscleclean", name:"Muscle Clean", type:'lift', group:"Full body", eq:"barbell", bar:true, k:"olympic"},
  {id:"cluster", name:"Cluster", type:'lift', group:"Full body", eq:"barbell", bar:true, k:"clean thruster crossfit"},
  {id:"groundtooverhead", name:"Ground to Overhead", type:'lift', group:"Full body", eq:"barbell", bar:true, k:"crossfit"},
  {id:"dbcleanpress", name:"Dumbbell Clean and Press", type:'lift', group:"Full body", eq:"dumbbell"},
  {id:"dbswing", name:"Dumbbell Swing", type:'lift', group:"Full body", eq:"dumbbell", k:"kettlebell style"},
  {id:"dbhangclean", name:"Dumbbell Hang Clean", type:'lift', group:"Full body", eq:"dumbbell"},
  {id:"dbcomplex", name:"Dumbbell Complex", type:'lift', group:"Full body", eq:"dumbbell", k:"circuit"},
  {id:"dbboxstepover", name:"Dumbbell Box Step-over", type:'lift', group:"Full body", eq:"dumbbell", k:"crossfit"},
  {id:"altdbsnatch", name:"Alternating Dumbbell Snatch", type:'lift', group:"Full body", eq:"dumbbell", k:"crossfit"},
  {id:"kbhighpull", name:"Kettlebell High Pull", type:'lift', group:"Full body", eq:"kettlebell"},
  {id:"kbcleansquatpress", name:"Kettlebell Clean, Squat and Press", type:'lift', group:"Full body", eq:"kettlebell", k:"complex"},
  {id:"kbfigure8", name:"Kettlebell Figure 8", type:'lift', group:"Full body", eq:"kettlebell", k:"between legs"},
  {id:"kbdeadclean", name:"Kettlebell Dead Clean", type:'lift', group:"Full body", eq:"kettlebell", k:"from floor"},
  {id:"kbjerk", name:"Kettlebell Jerk", type:'lift', group:"Full body", eq:"kettlebell", k:"long cycle"},
  {id:"kblongcycle", name:"Kettlebell Long Cycle", type:'lift', group:"Full body", eq:"kettlebell", k:"clean and jerk sport"},
  {id:"sledgehammer", name:"Sledgehammer Swings", type:'lift', group:"Full body", eq:"other", k:"tire"},
  {id:"slamballshoulder", name:"Slam Ball Over Shoulder", type:'lift', group:"Full body", eq:"other", k:"strongman"},
  {id:"sandbagshoulder", name:"Sandbag Shouldering", type:'lift', group:"Full body", eq:"other", k:"strongman"},
  {id:"sandbagtoss", name:"Sandbag Toss", type:'lift', group:"Full body", eq:"other", k:"strongman over bar"},
  {id:"kegcarry", name:"Keg Carry", type:'lift', group:"Full body", eq:"other", k:"strongman"},
  {id:"axlepress", name:"Axle Press", type:'lift', group:"Full body", eq:"other", k:"strongman fat bar"},
  {id:"circusdb", name:"Circus Dumbbell Press", type:'lift', group:"Full body", eq:"dumbbell", k:"strongman one arm"},
  {id:"cardeadlift", name:"Car Deadlift", type:'lift', group:"Full body", eq:"other", k:"strongman frame"},
  {id:"battleropewave", name:"Battle Rope Slams", type:'lift', group:"Full body", eq:"other", time:true, k:"alternating"},
  {id:"sledbearcrawl", name:"Bear Crawl Sled Pull", type:'lift', group:"Full body", eq:"sled", k:"hand over hand"},
  {id:"sledrow", name:"Sled Row", type:'lift', group:"Full body", eq:"sled", k:"hand over hand rope"},
  {id:"sledsprint", name:"Sled Sprint", type:'lift', group:"Full body", eq:"sled", k:"prowler speed"},
  {id:"rowerburpee", name:"Burpee Over Rower", type:'lift', group:"Full body", eq:"bodyweight", bw:true, k:"crossfit"},
  {id:"barfacingburpee", name:"Bar-Facing Burpee", type:'lift', group:"Full body", eq:"bodyweight", bw:true, k:"crossfit"},
  {id:"burpeepullup", name:"Burpee Pull-up", type:'lift', group:"Full body", eq:"bodyweight", bw:true, k:"crossfit"},
  {id:"handreleasepushup", name:"Hand-Release Push-up", type:'lift', group:"Full body", eq:"bodyweight", bw:true, k:"crossfit"},
  {id:"bwsquatthrust", name:"Squat Thrust", type:'lift', group:"Full body", eq:"bodyweight", bw:true, k:"no push-up burpee"},
  {id:"wtdboxjump", name:"Weighted Box Jump", type:'lift', group:"Full body", eq:"dumbbell", k:"vest"},
  {id:"boxstepover", name:"Box Step-over", type:'lift', group:"Full body", eq:"bodyweight", bw:true, k:"crossfit"},
  {id:"leglessrope", name:"Legless Rope Climb", type:'lift', group:"Full body", eq:"bodyweight", bw:true, k:"arms only"},
  {id:"pegboard", name:"Pegboard Climb", type:'lift', group:"Full body", eq:"bodyweight", bw:true, k:"crossfit"},
  {id:"ringmuscleup", name:"Ring Muscle-up", type:'lift', group:"Full body", eq:"bodyweight", bw:true, k:"crossfit gymnastics"},
  {id:"wallballsitup", name:"Wall Ball Sit-up", type:'lift', group:"Full body", eq:"other", k:"medicine ball"},
  {id:"medballchest", name:"Medicine Ball Chest Pass", type:'lift', group:"Full body", eq:"other", k:"wall throw power"},
  {id:"medballohthrow", name:"Medicine Ball Overhead Throw", type:'lift', group:"Full body", eq:"other", k:"power"},
  // Cardio
  {id:"curvedtm", name:"Curved Treadmill", type:'cardio', group:"Cardio", eq:"treadmill", k:"self powered assault runner"},
  {id:"walkingpad", name:"Walking Pad", type:'cardio', group:"Cardio", eq:"treadmill", k:"under desk treadmill"},
  {id:"tmsprints", name:"Treadmill Sprints", type:'cardio', group:"Cardio", eq:"treadmill", k:"intervals"},
  {id:"hillsprints", name:"Hill Sprints", type:'cardio', group:"Cardio", eq:"outdoors", k:"running"},
  {id:"tempo", name:"Tempo Run", type:'cardio', group:"Cardio", eq:"outdoors", k:"threshold"},
  {id:"trackintervals", name:"Track Intervals", type:'cardio', group:"Cardio", eq:"outdoors", k:"repeats 400 800"},
  {id:"longrun", name:"Long Run", type:'cardio', group:"Cardio", eq:"outdoors", k:"distance"},
  {id:"recoveryrun", name:"Recovery Run", type:'cardio', group:"Cardio", eq:"outdoors", k:"easy jog"},
  {id:"fartlek", name:"Fartlek", type:'cardio', group:"Cardio", eq:"outdoors", k:"speed play"},
  {id:"stadiumstairs", name:"Stadium Stairs", type:'cardio', group:"Cardio", eq:"outdoors", k:"bleachers"},
  {id:"powerwalk", name:"Power Walk", type:'cardio', group:"Cardio", eq:"outdoors", k:"brisk"},
  {id:"treadmillhike", name:"Treadmill Hike", type:'cardio', group:"Cardio", eq:"treadmill", k:"steep incline 12 3 30"},
  {id:"jacobsladder", name:"Jacob's Ladder", type:'cardio', group:"Cardio", eq:"machine", k:"climber"},
  {id:"ube", name:"Upper Body Ergometer", type:'cardio', group:"Cardio", eq:"machine", k:"arm bike hand cycle"},
  {id:"rowerintervals", name:"Rowing Intervals", type:'cardio', group:"Cardio", eq:"rower", k:"concept2 500m repeats"},
  {id:"bikeintervals", name:"Bike Intervals", type:'cardio', group:"Cardio", eq:"bike", k:"sprints"},
  {id:"bikeerg", name:"BikeErg", type:'cardio', group:"Cardio", eq:"bike", k:"concept2"},
  {id:"doubleunders", name:"Double-Unders", type:'cardio', group:"Cardio", eq:"other", k:"jump rope crossfit"},
  {id:"shadowboxing", name:"Shadow Boxing", type:'cardio', group:"Cardio", eq:"other"},
  {id:"heavybag", name:"Heavy Bag", type:'cardio', group:"Cardio", eq:"other", k:"boxing"},
  {id:"speedbag", name:"Speed Bag", type:'cardio', group:"Cardio", eq:"other", k:"boxing"},
  {id:"rebounder", name:"Rebounder", type:'cardio', group:"Cardio", eq:"other", k:"trampoline"},
  {id:"metcon", name:"CrossFit WOD", type:'cardio', group:"Cardio", eq:"other", k:"metcon amrap emom"},
  {id:"bootcamp", name:"Bootcamp Class", type:'cardio', group:"Cardio", eq:"other", k:"class"},
  {id:"barre", name:"Barre", type:'cardio', group:"Cardio", eq:"other", k:"class"},
  {id:"spinclass", name:"Spin Class", type:'cardio', group:"Cardio", eq:"bike", k:"peloton cycling class"},
  {id:"aquajog", name:"Aqua Jogging", type:'cardio', group:"Cardio", eq:"pool", k:"water running"},
  {id:"waterpolo", name:"Water Polo", type:'cardio', group:"Cardio", eq:"pool"},
  {id:"surfing", name:"Surfing", type:'cardio', group:"Cardio", eq:"water", k:"paddle"},
  {id:"wakeboard", name:"Wakeboarding", type:'cardio', group:"Cardio", eq:"water", k:"boat"},
  {id:"waterski", name:"Water Skiing", type:'cardio', group:"Cardio", eq:"water", k:"boat"},
  {id:"wakesurf", name:"Wakesurfing", type:'cardio', group:"Cardio", eq:"water", k:"boat"},
  {id:"canoe", name:"Canoeing", type:'cardio', group:"Cardio", eq:"water", k:"paddle"},
  {id:"rowingwater", name:"Rowing (on water)", type:'cardio', group:"Cardio", eq:"water", k:"scull crew"},
  {id:"sailing", name:"Sailing", type:'cardio', group:"Cardio", eq:"water", k:"boat"},
  {id:"snorkel", name:"Snorkeling", type:'cardio', group:"Cardio", eq:"water", k:"swim"},
  {id:"football", name:"Football", type:'cardio', group:"Cardio", eq:"sport", k:"flag touch"},
  {id:"baseball", name:"Baseball", type:'cardio', group:"Cardio", eq:"sport", k:"softball"},
  {id:"lacrosse", name:"Lacrosse", type:'cardio', group:"Cardio", eq:"sport"},
  {id:"rugby", name:"Rugby", type:'cardio', group:"Cardio", eq:"sport"},
  {id:"racquetball", name:"Racquetball", type:'cardio', group:"Cardio", eq:"sport", k:"squash"},
  {id:"badminton", name:"Badminton", type:'cardio', group:"Cardio", eq:"sport"},
  {id:"tabletennis", name:"Table Tennis", type:'cardio', group:"Cardio", eq:"sport", k:"ping pong"},
  {id:"skiing", name:"Downhill Skiing", type:'cardio', group:"Cardio", eq:"sport", k:"alpine"},
  {id:"snowboarding", name:"Snowboarding", type:'cardio', group:"Cardio", eq:"sport"},
  {id:"iceskating", name:"Ice Skating", type:'cardio', group:"Cardio", eq:"sport"},
  {id:"ultimate", name:"Ultimate Frisbee", type:'cardio', group:"Cardio", eq:"sport"},
  {id:"discgolf", name:"Disc Golf", type:'cardio', group:"Cardio", eq:"sport", k:"walking"},
  {id:"bjj", name:"Jiu-Jitsu", type:'cardio', group:"Cardio", eq:"sport", k:"bjj grappling wrestling"},
  {id:"wrestling", name:"Wrestling", type:'cardio', group:"Cardio", eq:"sport", k:"grappling"},
  {id:"mma", name:"MMA", type:'cardio', group:"Cardio", eq:"sport", k:"mixed martial arts"},
  {id:"trackfield", name:"Track Practice", type:'cardio', group:"Cardio", eq:"sport", k:"sprints drills"},
  {id:"skateboarding", name:"Skateboarding", type:'cardio', group:"Cardio", eq:"sport"},
  {id:"foamroll", name:"Foam Rolling", type:'cardio', group:"Cardio", eq:"other", k:"recovery"},
  {id:"hotyoga", name:"Hot Yoga", type:'cardio', group:"Cardio", eq:"other", k:"bikram"},
  {id:"taichi", name:"Tai Chi", type:'cardio', group:"Cardio", eq:"other"},
  {id:"walkdog", name:"Dog Walk", type:'cardio', group:"Cardio", eq:"outdoors", k:"walk"},
  {id:"yardwork", name:"Yard Work", type:'cardio', group:"Cardio", eq:"outdoors", k:"mowing gardening"},
  {id:"pickupgame", name:"Pickup Game", type:'cardio', group:"Cardio", eq:"sport", k:"any sport"}
];
const GROUPS = ['Chest','Shoulders','Back','Arms','Legs','Core','Full body','Cardio'];
const CAT = {}; CATALOG.forEach(e => CAT[e.id] = e);

const TEMPLATES = [
  {id:'push', name:'Push', items:[['bench',4,6,8],['ohp',3,6,8],['incdb',3,8,10],['latraise',3,12,15],['pushdown',3,10,12]]},
  {id:'pull', name:'Pull', items:[['row',4,6,8],['pulldown',3,8,10],['cablerow',3,8,10],['facepull',3,12,15],['curl',3,8,10]]},
  {id:'legs', name:'Legs', items:[['squat',4,6,8],['rdl',3,8,10],['legpress',3,10,12],['legcurl',3,10,12],['calf',3,12,15]]},
  {id:'upper', name:'Upper', items:[['bench',4,5,6],['row',4,5,6],['ohp',3,6,8],['pulldown',3,8,10],['curl',2,10,12],['pushdown',2,10,12]]},
  {id:'lower', name:'Lower', items:[['squat',4,5,6],['rdl',3,6,8],['lunge',3,8,10],['legcurl',3,10,12],['calf',3,12,15]]},
  {id:'full', name:'Full Body', items:[['squat',3,5,5],['bench',3,5,5],['row',3,5,5],['ohp',2,6,8],['pullup',2,6,8]]},
  {id:'run', name:'Run', items:[['run','min',30]]},
  {id:'longrun', name:'Long Run', items:[['run','min',60]]},
  {id:'inclinewalk', name:'Incline Walk', items:[['inclinewalk','min',45]]},
  {id:'tmintervals', name:'Treadmill Intervals', items:[['treadmill','min',30]]},
  {id:'bike', name:'Bike', items:[['bike','min',30]]},
  {id:'rowing', name:'Rowing', items:[['rower','min',20]]},
  {id:'swim', name:'Swim', items:[['swim','min',30]]}
];
const templateIsCardio = t => t.items.every(a => a[1] === 'min');
/* Equipment choices for custom exercises. Barbell and trap bar get plate math; bodyweight gets the added-weight field. */
const LIFT_EQ = [['barbell', 'Barbell'], ['dumbbell', 'Dumbbell'], ['kettlebell', 'Kettlebell'], ['machine', 'Machine'], ['cable', 'Cable'], ['smith', 'Smith machine'], ['EZ bar', 'EZ bar'], ['trap bar', 'Trap bar'], ['landmine', 'Landmine'], ['band', 'Band'], ['bodyweight', 'Bodyweight'], ['sled', 'Sled'], ['other', 'Other']];
const CARDIO_EQ = [['outdoors', 'Outdoors'], ['treadmill', 'Treadmill'], ['bike', 'Bike'], ['rower', 'Rower'], ['machine', 'Machine'], ['pool', 'Pool'], ['water', 'Water'], ['sport', 'Sport or class'], ['other', 'Other']];
const eqLabel = eq => { const all = LIFT_EQ.concat(CARDIO_EQ), hit = all.find(x => x[0] === eq); return hit ? hit[1] : (eq || ''); };
/* Search: every word must match the name, group, equipment or keywords; common gym shorthand is expanded first. */
const SEARCH_ALIASES = {db: 'dumbbell', bb: 'barbell', kb: 'kettlebell', ohp: 'overhead press', rdl: 'romanian deadlift', bss: 'bulgarian split squat', rfess: 'bulgarian split squat', dl: 'deadlift', sldl: 'stiff-leg deadlift', ghr: 'glute-ham raise', tricep: 'triceps', bicep: 'biceps', hammies: 'hamstring', quads: 'quad', lats: 'lat', pecs: 'chest', delts: 'shoulder', abs: 'core', ab: 'core', stairmaster: 'stair', tm: 'treadmill', ez: 'EZ bar', hex: 'trap bar', flye: 'fly', flyes: 'fly', pullups: 'pull-up', chinups: 'chin-up', pushups: 'push-up', situps: 'sit-up'};
function normQ(q){ return q.toLowerCase().split(/\s+/).filter(Boolean).map(w => SEARCH_ALIASES[w] || w).join(' '); }
function exMatches(e, q){ if (!q) return true; const hay = (e.name + ' ' + (e.group || '') + ' ' + (e.eq || '') + ' ' + eqLabel(e.eq) + ' ' + (e.k || '')).toLowerCase(); return normQ(q).split(' ').every(w => hay.indexOf(w) >= 0); }
/* What the user tracks: lifting, cardio, or both. Filters what is offered; never touches logged data. */
const liftOn = () => !!(state.settings.track && state.settings.track.lift);
const cardioOn = () => !!(state.settings.track && state.settings.track.cardio);
/* Recovery sessions: sauna and cold tub, minutes only, kept apart from workouts so they never touch the score or the plan. */
/* Each kind switches on its own; recovery is on when any of them is. */
/* Water: logged in ounces, shown in ounces or millilitres with the unit setting. The daily goal follows body weight
   (half an ounce per pound, kept between 64 and 128 oz) unless set by hand, plus 16 oz on a training day. */
const OZ_PER_ML = 1 / 29.5735;
const waterOn = () => !!(state.settings.water && state.settings.water.on);
const waterUnit = () => isKg() ? 'ml' : 'oz';
function dispVol(oz){ return isKg() ? Math.round(oz / OZ_PER_ML / 10) * 10 : Math.round(oz); }
function volToOz(v){ return isKg() ? v * OZ_PER_ML : v; }
/* The base is exactly half your body weight in ounces, held between 64 and 128. On top of that, each day adds 12 oz per half hour of training,
   16 oz per 15 minutes of sauna and 8 oz per 15 minutes of hot tub (sweat replacement), each capped, and the card shows the sum. */
function waterAutoGoal(){ const bw = state.profile.bw; return bw ? clamp(Math.round(bw * 0.5), 64, 128) : 80; }
function waterExtras(date){
  const s = state.settings.water || {}, out = {train: 0, trainMin: 0, sauna: 0, saunaMin: 0, hot: 0, hotMin: 0, total: 0};
  if (s.bonus === false) return out;
  let sec = 0; for (const w of workoutsOn(date)) sec += durOf(w); if (state.active && state.active.date === date) sec += elapsedSec(state.active);
  out.trainMin = Math.round(sec / 60); if (out.trainMin > 0) out.train = Math.min(48, Math.max(12, Math.round(out.trainMin / 30) * 12));
  for (const r of recoveryOn_(date)) { if (r.kind === 'sauna') out.saunaMin += r.min || 0; else if (r.kind === 'hot') out.hotMin += r.min || 0; }
  if (out.saunaMin > 0) out.sauna = Math.min(48, Math.max(8, Math.round(out.saunaMin / 15) * 16));
  if (out.hotMin > 0) out.hot = Math.min(24, Math.max(4, Math.round(out.hotMin / 15) * 8));
  out.total = out.train + out.sauna + out.hot; return out;
}
function waterGoal(date){ const s = state.settings.water || {}, base = s.goal || waterAutoGoal(), x = waterExtras(date); return {base: base, extras: x, bonus: x.total, total: base + x.total, auto: !s.goal}; }
/* One line that says where today's number came from. */
function waterWhy(date){
  const g = waterGoal(date), u = waterUnit(), bw = state.profile.bw, x = g.extras, v = n => dispVol(n) + ' ' + u;
  const parts = []; if (x.train) parts.push(v(x.train) + ' for ' + x.trainMin + ' min of training'); if (x.sauna) parts.push(v(x.sauna) + ' for ' + x.saunaMin + ' min of sauna'); if (x.hot) parts.push(v(x.hot) + ' for ' + x.hotMin + ' min of hot tub');
  const raw = bw ? bw * 0.5 : 0, half = 'Half your body weight (' + dispW(bw) + ' ' + wUnit() + ')';
  const base = g.auto ? (bw ? (raw < g.base - 0.5 ? half + ' would be ' + v(raw) + ', so the ' + v(g.base) + ' minimum applies' : raw > g.base + 0.5 ? half + ' would be ' + v(raw) + ', capped at ' + v(g.base) : half + ' is ' + v(g.base)) : v(g.base) + ' is a default until you add your body weight under You') : 'Your goal is set to ' + v(g.base);
  return base + (parts.length ? ', plus ' + parts.join(', ') + '.' : '.');
}
function waterLogs(date){ return (state.water && state.water[date]) || []; }
function waterTotal(date){ return waterLogs(date).reduce((a, x) => a + (x.oz || 0), 0); }
function waterAdd(date, oz){ if (!state.water) state.water = {}; (state.water[date] = state.water[date] || []).push({t: Date.now(), oz: Math.round(oz * 100) / 100}); save(); }
const WATER_QUICK = () => isKg() ? [250, 500, 750] : [8, 16, 24];
const REC_KINDS = [['sauna', 'Sauna', 15, 'Sauna'], ['cold', 'Cold tub', 3, 'Cold'], ['hot', 'Hot tub', 15, 'Hot']];
const recKinds = () => REC_KINDS.filter(k => state.settings.rec && state.settings.rec[k[0]]);
const recoveryOn = () => recKinds().length > 0;
const recKind = k => REC_KINDS.find(x => x[0] === k) || REC_KINDS[0];
function recoveryOn_(date){ return state.recovery.filter(r => r.date === date).sort((a, b) => a.t - b.t); }
function recoverySince(from, kind){ return state.recovery.filter(r => r.date >= from && (!kind || r.kind === kind)); }
/* Temperatures are stored in °F like weights are stored in lb; kg users see °C. Sauna steps by 5°F, the cold tub by 1°F. */
const isC = () => state.settings.tempUnit ? state.settings.tempUnit === 'c' : isKg();
const dispT = f => String(Math.round(isC() ? (f - 32) * 5 / 9 : f));
const toF = v => isC() ? v * 9 / 5 + 32 : v;
const tUnit = () => isC() ? '°C' : '°F';
const REC_TEMP = {sauna: 180, cold: 45, hot: 102};
function lastRecoveryTemp(kind){ const list = state.recovery.filter(r => r.kind === kind && r.temp).sort((a, b) => b.t - a.t); return list.length ? list[0].temp : null; }
function lastRecoveryMin(kind){ const list = state.recovery.filter(r => r.kind === kind).sort((a, b) => b.t - a.t); return list.length ? list[0].min : recKind(kind)[2]; }
const visibleEx = e => e.type === 'cardio' ? cardioOn() : liftOn();
const visibleTemplates = () => TEMPLATES.filter(t => templateIsCardio(t) ? cardioOn() : liftOn());
function routineFromTemplate(t, id){
  return {id: id || t.id, name: t.name, items: t.items.map(a => a[1] === 'min' ? {ex: a[0], sets: 1, min: a[2]} : {ex: a[0], sets: a[1], reps: a[2], hi: a[3]})};
}

/* ---------- state ---------- */
let state = null;

function ex(id){ return CAT[id] || (state && state.custom.find(e => e.id === id)) || {id: id, name: 'Unknown exercise', type: 'lift', group: ''}; }
function routine(id){ return state.routines.find(r => r.id === id) || null; }

function fresh(withSample){
  const s = {
    v: 1, sample: !!withSample,
    settings: {unit: 'lb', rest: 90, sound: true, vibrate: true, metrics: {score: true, days7: true, lifted7: true, bwChange: true, run: false, walk: false, cycle: false, swim: false, lifted30: false, days30: false, days60: false, days90: false}, rpSecs: 20, bwReminderDays: 0, showBf: false, wuRest: 60, track: {lift: true, cardio: true}, rec: withSample ? {sauna: true, cold: true, hot: true} : {sauna: false, cold: false, hot: false}, score: true, goalDays: 0, water: {on: false, goal: 0, bonus: true}, lightUntil: null, setupDone: !!withSample},
    profile: withSample ? {sex: 'm', age: 35, bw: 180, height: 70, activity: 'mod', goal: 'gain', level: 'consistent'} : {sex: null, age: null, bw: null, height: null, activity: 'mod', goal: 'maintain', level: null},
    exRest: {}, exNotes: {}, exTempo: {}, exTm: {}, exWuRest: {},
    bodyweights: withSample ? sampleBodyweights() : [],
    custom: [], recovery: [], water: {}, cycle: {on: false, seq: [], start: todayKey()}, deleted: {w: {}, r: {}}, sync: {rev: 0},
    routines: withSample ? ['push','pull','legs','run'].map(id => routineFromTemplate(TEMPLATES.find(t => t.id === id))) : [],
    plan: withSample ? {0: [], 1: ['push'], 2: ['pull'], 3: ['run'], 4: ['legs'], 5: [], 6: ['run']} : {0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: []},
    workouts: [], active: null, timer: null, since: todayKey(),
    ui: {view: 'today', tab: 'today', openHist: null, progEx: null}
  };
  if (withSample) { s.workouts = makeSample(s); s.since = earliestDate(s.workouts); }
  return s;
}
function earliestDate(ws){ return ws.length ? ws.map(w => w.date).sort()[0] : todayKey(); 
}
function load(){
  try { const raw = localStorage.getItem(KEY); if (!raw) return null; return normalizeState(JSON.parse(raw)); } catch (e) { return null; }
}
function normalizeState(s){
  try {
    if (!s || s.v !== 1 || !s.settings || !Array.isArray(s.workouts)) return null;
    s.ui = Object.assign({view: 'today', tab: 'today', openHist: null, progEx: null}, s.ui || {});
    if (s.ui.view === 'workout' && !s.active) s.ui.view = 'today';
    s.custom = s.custom || []; s.custom.forEach(e => { if (!e.eq || e.eq === 'custom') e.eq = e.bar ? 'barbell' : e.bw ? 'bodyweight' : 'other'; });
    s.profile = Object.assign({sex: null, age: null, bw: null, height: null, activity: 'mod', goal: 'maintain'}, s.profile || {});
    s.exRest = s.exRest || {}; s.exNotes = s.exNotes || {}; s.exTempo = s.exTempo || {}; s.exTm = s.exTm || {}; s.exWuRest = s.exWuRest || {}; s.bodyweights = s.bodyweights || [];
    s.settings.metrics = Object.assign({score: true, days7: true, lifted7: true, bwChange: true, run: false, walk: false, cycle: false, swim: false, lifted30: false, days30: false, days60: false, days90: false}, s.settings.metrics || {});
    if (!s.settings.rpSecs) s.settings.rpSecs = 20; s.cycle = Object.assign({on: false, seq: [], start: todayKey()}, s.cycle || {}); if (!Array.isArray(s.cycle.seq)) s.cycle.seq = [];
    if (s.settings.bwReminderDays === undefined) s.settings.bwReminderDays = 0; if (s.settings.showBf === undefined) s.settings.showBf = false; if (s.settings.wuRest === undefined) s.settings.wuRest = 60; s.settings.track = Object.assign({lift: true, cardio: true}, s.settings.track || {}); s.recovery = s.recovery || []; if (!s.settings.rec) { const on = s.settings.track.recovery !== false; s.settings.rec = {sauna: on, cold: on, hot: on}; } delete s.settings.track.recovery; if (!s.settings.track.lift && !s.settings.track.cardio) s.settings.track = {lift: true, cardio: true}; if (s.settings.setupDone === undefined) s.settings.setupDone = true; if (s.settings.score === undefined) s.settings.score = true; if (s.settings.goalDays === undefined) s.settings.goalDays = 0;
    if (!s.settings.water) s.settings.water = {on: false, goal: 0, bonus: true}; if (s.settings.lightUntil === undefined) s.settings.lightUntil = null; s.water = s.water || {};
    s.plan = s.plan || {}; for (const d of [0, 1, 2, 3, 4, 5, 6]) { const v = s.plan[d]; s.plan[d] = Array.isArray(v) ? v.filter(Boolean) : (v ? [v] : []); }
    if (s.active && s.active.pausedTotal === undefined) s.active.pausedTotal = 0;
    if (!s.since) s.since = earliestDate(s.workouts);
    s.deleted = Object.assign({w: {}, r: {}}, s.deleted || {}); s.sync = Object.assign({rev: 0}, s.sync || {});
    return s;
  } catch (e) { return null; }
}
let saveT = null;
function saveNow(){ try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} if (typeof schedulePush === 'function') schedulePush(); }
function save(){ clearTimeout(saveT); saveT = setTimeout(saveNow, 150); }

/* ---------- units (stored as lb, mi, seconds) ---------- */
const LB_PER_KG = 2.20462, KM_PER_MI = 1.60934;
const isKg = () => state.settings.unit === 'kg';
const wUnit = () => isKg() ? 'kg' : 'lb';
const dUnit = () => isKg() ? 'km' : 'mi';
const wStep = () => isKg() ? 2.5 : 5;
function dispW(lb){ const v = isKg() ? lb / LB_PER_KG : lb; return String(Math.round(v * 2) / 2); }
function toLb(v){ v = Number(v) || 0; return isKg() ? v * LB_PER_KG : v; }
function dispD(mi){ const v = isKg() ? mi * KM_PER_MI : mi; return String(Math.round(v * 100) / 100); }
function toMi(v){ v = Number(v) || 0; return isKg() ? v / KM_PER_MI : v; }
function fmtVol(lb){ const v = isKg() ? lb / LB_PER_KG : lb; return Math.round(v).toLocaleString('en-US'); }
function paceOf(sec, mi){ if (!mi || !sec) return null; const d = isKg() ? mi * KM_PER_MI : mi; return sec / d; }
function paceLabel(sec, mi){ const p = paceOf(sec, mi); return p ? mmss(p) + ' /' + dUnit() : ''; }

/* ---------- plate math ---------- */
const PLATE_STYLE = {
  lb: {45: ['--p-blue', 24, 7], 35: ['--p-yellow', 21, 6], 25: ['--p-green', 18, 6], 10: ['--p-white', 14, 5], 5: ['--p-black', 12, 4], 2.5: ['--p-black', 9, 3]},
  kg: {25: ['--p-red', 24, 7], 20: ['--p-blue', 22, 7], 15: ['--p-yellow', 20, 6], 10: ['--p-green', 17, 6], 5: ['--p-white', 14, 5], 2.5: ['--p-black', 12, 4], 1.25: ['--p-black', 9, 3]}
};
/* Plate loading with a chosen bar and only the plates you have. Greedy from the heaviest plate; anything left over is reported. */
const BARS = {lb: [45, 35, 15], kg: [20, 15, 10]};
function platesWith(total, bar, sizes){
  total = Math.round(total * 4) / 4; if (total < bar) return null;
  let side = (total - bar) / 2; const out = [];
  for (const p of sizes.slice().sort((a, b) => b - a)) { while (side >= p - 1e-9) { out.push(p); side -= p; } }
  return {plates: out, rem: Math.round(side * 100) / 100, bar: bar, made: Math.round((total - 2 * side) * 100) / 100};
}
function platesFor(lb){
  const kg = isKg(); const bar = kg ? 20 : 45; const sizes = kg ? [25,20,15,10,5,2.5,1.25] : [45,35,25,10,5,2.5];
  let total = kg ? lb / LB_PER_KG : lb; total = Math.round(total * 4) / 4;
  if (total < bar) return null;
  let side = (total - bar) / 2; const out = [];
  for (const p of sizes) { while (side >= p - 1e-9) { out.push(p); side -= p; } }
  return {plates: out, rem: side, bar: bar};
}
function platesHTML(lb){
  const p = platesFor(lb); const u = wUnit();
  if (!p) return '<span>Below the empty bar (' + (isKg() ? 20 : 45) + ' ' + u + ')</span>';
  if (!p.plates.length) return '<span>Empty bar · ' + p.bar + ' ' + u + '</span>';
  const st = PLATE_STYLE[isKg() ? 'kg' : 'lb'];
  const discs = p.plates.map(w => { const s = st[w]; return '<i class="disc" style="background:var(' + s[0] + ');height:' + s[1] + 'px;width:' + s[2] + 'px"' + (s[0] === '--p-black' ? ' data-rim' : '') + '></i>'; }).join('');
  return '<span class="discs">' + discs + '</span><span>Per side: <b>' + p.plates.join(' · ') + '</b>' + (p.rem > 0.01 ? ' <span class="faint">(+' + p.rem + ' short)</span>' : '') + '</span>';
}

/* ---------- training math ---------- */
function e1rm(w, r){ if (!w || !r) return 0; return r <= 1 ? w : w * (1 + r / 30); }
function brzycki(w, r){ if (!w || !r) return 0; return r <= 1 ? w : (r < 37 ? w * 36 / (37 - r) : e1rm(w, r)); }
function e1rmBlend(w, r){ if (!w || !r) return 0; return r <= 1 ? w : (r > 12 ? e1rm(w, r) : (e1rm(w, r) + brzycki(w, r)) / 2); }
/* Strength standards: level thresholds as a multiple of body weight (one-rep max / body weight), men, ages 18 to 39.
   Our own ladder, in the spirit of the usual beginner / novice / intermediate / advanced / elite guideposts, not copied from any site.
   Women and older lifters are scaled below. Dumbbell lifts are per hand. */
const STD = {
  squat: [0.75, 1.25, 1.50, 2.00, 2.50], frontsquat: [0.60, 1.00, 1.25, 1.60, 2.00], deadlift: [1.00, 1.50, 2.00, 2.50, 3.00],
  rdl: [0.75, 1.10, 1.50, 1.90, 2.40], hipthrust: [1.00, 1.50, 2.00, 2.75, 3.50], bench: [0.50, 0.75, 1.00, 1.50, 2.00],
  ohp: [0.35, 0.55, 0.80, 1.00, 1.35], row: [0.50, 0.75, 1.00, 1.25, 1.75], curl: [0.25, 0.40, 0.55, 0.75, 1.00],
  dbbench: [0.20, 0.35, 0.50, 0.70, 0.90], incdb: [0.18, 0.30, 0.45, 0.62, 0.80], dbohp: [0.15, 0.25, 0.35, 0.50, 0.65],
  dbrow: [0.25, 0.40, 0.55, 0.75, 0.95], dbcurl: [0.10, 0.18, 0.25, 0.35, 0.45], hammer: [0.10, 0.18, 0.25, 0.35, 0.45], lunge: [0.15, 0.30, 0.45, 0.65, 0.85],
  incbench: [0.40, 0.60, 0.85, 1.20, 1.60], cgbench: [0.45, 0.65, 0.90, 1.30, 1.75], decbench: [0.55, 0.80, 1.05, 1.55, 2.05], sumo: [1.00, 1.50, 2.00, 2.50, 3.00], trapbar: [1.10, 1.60, 2.10, 2.60, 3.10],
  pushpress: [0.45, 0.70, 0.95, 1.25, 1.60], seatedohp: [0.35, 0.55, 0.75, 1.00, 1.30], pendlay: [0.50, 0.75, 1.00, 1.25, 1.75], uprightrow: [0.30, 0.50, 0.70, 0.95, 1.20], shrug: [0.75, 1.20, 1.70, 2.30, 3.00],
  boxsquat: [0.75, 1.25, 1.50, 2.00, 2.50], pausesquat: [0.65, 1.10, 1.35, 1.80, 2.25], sldl: [0.70, 1.00, 1.40, 1.80, 2.20], goodmorning: [0.30, 0.50, 0.75, 1.00, 1.30],
  powerclean: [0.50, 0.80, 1.10, 1.40, 1.75], hangclean: [0.50, 0.80, 1.10, 1.40, 1.75], cleanjerk: [0.55, 0.85, 1.15, 1.50, 1.90], snatch: [0.40, 0.60, 0.85, 1.10, 1.40], thruster: [0.40, 0.65, 0.90, 1.20, 1.50],
  highbar: [0.75, 1.25, 1.50, 2.00, 2.50], lowbar: [0.80, 1.30, 1.60, 2.10, 2.60], zercher: [0.60, 1.00, 1.30, 1.70, 2.10], ohsquat: [0.40, 0.70, 0.95, 1.25, 1.60], pinsquat: [0.65, 1.10, 1.35, 1.80, 2.25],
  bblunge: [0.30, 0.60, 0.90, 1.30, 1.70], seatedgm: [0.30, 0.50, 0.75, 1.00, 1.30], bbglutebridge: [0.90, 1.35, 1.80, 2.50, 3.15], dbsquat: [0.20, 0.35, 0.50, 0.70, 0.90], splitsquat: [0.15, 0.30, 0.45, 0.65, 0.85], dbhipthrust: [0.30, 0.50, 0.75, 1.00, 1.30],
  wgbench: [0.48, 0.72, 0.95, 1.43, 1.90], pausebench: [0.45, 0.68, 0.90, 1.35, 1.80], spoto: [0.45, 0.68, 0.90, 1.35, 1.80], floorpress: [0.48, 0.72, 0.95, 1.43, 1.90], jmpress: [0.35, 0.52, 0.72, 1.04, 1.40], dbfloor: [0.18, 0.32, 0.45, 0.63, 0.81], sadbbench: [0.20, 0.35, 0.50, 0.70, 0.90], decdb: [0.21, 0.37, 0.53, 0.74, 0.95],
  zpress: [0.30, 0.47, 0.68, 0.85, 1.15], btnpress: [0.32, 0.50, 0.72, 0.90, 1.22], seateddbohp: [0.15, 0.25, 0.35, 0.50, 0.65], sadbohp: [0.15, 0.25, 0.35, 0.50, 0.65], dbpushpress: [0.18, 0.30, 0.42, 0.60, 0.78], kbpress: [0.15, 0.25, 0.35, 0.50, 0.65],
  deficitdl: [0.90, 1.35, 1.80, 2.25, 2.70], pausedl: [0.90, 1.35, 1.80, 2.25, 2.70], blockpull: [1.10, 1.65, 2.20, 2.75, 3.30], snatchdl: [0.90, 1.35, 1.80, 2.25, 2.70], trapbarhigh: [1.15, 1.70, 2.20, 2.70, 3.25], trapbarrdl: [0.85, 1.20, 1.65, 2.10, 2.65], kbdeadlift: [0.50, 0.80, 1.10, 1.40, 1.75],
  yates: [0.55, 0.82, 1.10, 1.38, 1.92], sealrow: [0.40, 0.60, 0.80, 1.00, 1.40], dbsealrow: [0.22, 0.36, 0.50, 0.68, 0.85], kroc: [0.28, 0.44, 0.60, 0.82, 1.05], incdbrow: [0.22, 0.36, 0.50, 0.68, 0.85],
  dragcurl: [0.22, 0.36, 0.50, 0.68, 0.90], wgcurl: [0.25, 0.40, 0.55, 0.75, 1.00], altcurl: [0.10, 0.18, 0.25, 0.35, 0.45], zottman: [0.08, 0.14, 0.20, 0.28, 0.36], dbpreacher: [0.09, 0.16, 0.22, 0.32, 0.40], crossbody: [0.10, 0.18, 0.25, 0.35, 0.45],
  cleanpull: [0.58, 0.92, 1.26, 1.60, 2.00], powersnatch: [0.38, 0.57, 0.80, 1.05, 1.33], hangsnatch: [0.36, 0.54, 0.76, 1.00, 1.26], splitjerk: [0.55, 0.85, 1.15, 1.50, 1.90], pushjerk: [0.52, 0.80, 1.10, 1.42, 1.80], dbthruster: [0.15, 0.25, 0.35, 0.50, 0.65], dbsnatch: [0.16, 0.27, 0.38, 0.55, 0.72], kbsnatch: [0.16, 0.27, 0.38, 0.55, 0.72],
  ezcurl: [0.25, 0.40, 0.55, 0.75, 1.00], goblet: [0.20, 0.35, 0.50, 0.70, 0.90], bss: [0.15, 0.30, 0.45, 0.65, 0.85], dbrdl: [0.25, 0.45, 0.65, 0.90, 1.15], arnold: [0.12, 0.22, 0.32, 0.45, 0.60], dbfly: [0.10, 0.18, 0.28, 0.40, 0.52],
  smithbench: [0.50, 0.75, 1.05, 1.50, 2.00], smithinc: [0.45, 0.65, 0.90, 1.30, 1.70], smithdec: [0.55, 0.80, 1.10, 1.55, 2.05], chestpress: [0.45, 0.75, 1.10, 1.55, 2.00], incchestpress: [0.40, 0.65, 0.95, 1.35, 1.75], hammerchest: [0.45, 0.75, 1.10, 1.55, 2.00], hammerinc: [0.40, 0.65, 0.95, 1.35, 1.75], decmachpress: [0.50, 0.80, 1.15, 1.60, 2.05],
  pecdeck: [0.35, 0.60, 0.90, 1.25, 1.65], machfly: [0.35, 0.60, 0.90, 1.25, 1.65], cablefly: [0.15, 0.25, 0.40, 0.55, 0.75], cableflylow: [0.15, 0.25, 0.40, 0.55, 0.75], cableflyhigh: [0.15, 0.25, 0.40, 0.55, 0.75], sacablefly: [0.08, 0.14, 0.20, 0.28, 0.36], cablepress: [0.30, 0.50, 0.70, 0.95, 1.25], boardpress: [0.55, 0.80, 1.05, 1.55, 2.05], revgripbench: [0.40, 0.60, 0.85, 1.20, 1.60], guillotine: [0.40, 0.60, 0.85, 1.20, 1.60], dbsqueeze: [0.15, 0.28, 0.40, 0.55, 0.70], incdbfly: [0.10, 0.18, 0.28, 0.40, 0.52], decdbfly: [0.10, 0.18, 0.28, 0.40, 0.52], pullover: [0.20, 0.35, 0.50, 0.70, 0.90],
  landmine: [0.30, 0.50, 0.70, 0.95, 1.25], machohp: [0.35, 0.55, 0.80, 1.10, 1.45], smithohp: [0.35, 0.55, 0.80, 1.05, 1.40], viking: [0.40, 0.60, 0.85, 1.15, 1.50], bradford: [0.30, 0.45, 0.65, 0.85, 1.10], kbpushpress: [0.15, 0.25, 0.35, 0.50, 0.65],
  latraise: [0.05, 0.10, 0.15, 0.22, 0.30], leanlat: [0.05, 0.10, 0.15, 0.22, 0.30], seatedlat: [0.05, 0.10, 0.15, 0.22, 0.30], cablelat: [0.05, 0.10, 0.15, 0.22, 0.30], machlat: [0.25, 0.40, 0.60, 0.85, 1.10], frontraise: [0.06, 0.10, 0.16, 0.24, 0.32], cablefront: [0.10, 0.18, 0.28, 0.40, 0.52], platefront: [0.10, 0.18, 0.28, 0.40, 0.52], reardelt: [0.05, 0.10, 0.15, 0.22, 0.30], increar: [0.05, 0.10, 0.15, 0.22, 0.30], cablerear: [0.05, 0.10, 0.15, 0.22, 0.30], revpecdeck: [0.30, 0.50, 0.75, 1.05, 1.40], ytw: [0.03, 0.05, 0.08, 0.12, 0.16], cubanpress: [0.05, 0.10, 0.15, 0.22, 0.30], facepull: [0.20, 0.35, 0.50, 0.70, 0.90],
  dbshrug: [0.30, 0.50, 0.75, 1.00, 1.30], smithshrug: [0.90, 1.40, 2.00, 2.70, 3.50], cableshrug: [0.60, 1.00, 1.40, 1.90, 2.50], dbuprightrow: [0.12, 0.20, 0.30, 0.42, 0.55], cableupright: [0.30, 0.50, 0.70, 0.95, 1.20], externalrot: [0.05, 0.10, 0.15, 0.20, 0.28], internalrot: [0.05, 0.10, 0.15, 0.20, 0.28], dbextrot: [0.03, 0.06, 0.09, 0.13, 0.18],
  rackpull: [1.20, 1.80, 2.40, 3.00, 3.60], tbar: [0.50, 0.80, 1.15, 1.55, 2.00], meadows: [0.25, 0.40, 0.60, 0.80, 1.05], landminerow: [0.50, 0.75, 1.05, 1.40, 1.80], csrow: [0.20, 0.35, 0.50, 0.68, 0.85], hsrow: [0.50, 0.80, 1.15, 1.55, 2.00], hsrowhigh: [0.50, 0.80, 1.15, 1.55, 2.00], machrow: [0.50, 0.80, 1.15, 1.55, 2.00], smithrow: [0.50, 0.75, 1.00, 1.35, 1.75],
  cablerow: [0.50, 0.75, 1.05, 1.40, 1.80], lowcablerow: [0.50, 0.75, 1.05, 1.40, 1.80], wgcablerow: [0.45, 0.70, 1.00, 1.35, 1.70], sacablerow: [0.25, 0.40, 0.55, 0.75, 0.95], pulldown: [0.50, 0.75, 1.00, 1.35, 1.70], cgpulldown: [0.50, 0.75, 1.05, 1.40, 1.75], wgpulldown: [0.45, 0.70, 0.95, 1.30, 1.65], ngpulldown: [0.50, 0.75, 1.05, 1.40, 1.75], sapulldown: [0.25, 0.40, 0.55, 0.75, 0.95], onearmpulldown: [0.25, 0.40, 0.55, 0.75, 0.95], machpulldown: [0.50, 0.75, 1.00, 1.35, 1.70], cablepullover: [0.30, 0.50, 0.70, 0.95, 1.20], jeffersoncurl: [0.20, 0.35, 0.50, 0.70, 0.90], reversehyper: [0.50, 0.80, 1.15, 1.60, 2.05],
  inccurl: [0.08, 0.15, 0.22, 0.30, 0.40], conccurl: [0.08, 0.14, 0.20, 0.28, 0.36], spider: [0.08, 0.14, 0.20, 0.28, 0.36], cablecurl: [0.25, 0.40, 0.60, 0.80, 1.05], ropecurl: [0.25, 0.40, 0.60, 0.80, 1.05], highcablecurl: [0.15, 0.25, 0.35, 0.50, 0.65], bayesian: [0.10, 0.18, 0.25, 0.35, 0.45], machcurl: [0.25, 0.40, 0.60, 0.80, 1.05], machpreacher: [0.25, 0.40, 0.60, 0.80, 1.05], bbwristcurl: [0.25, 0.40, 0.55, 0.75, 1.00], wristcurl: [0.10, 0.18, 0.25, 0.35, 0.45], revwrist: [0.08, 0.14, 0.20, 0.28, 0.36],
  pushdown: [0.30, 0.50, 0.70, 0.95, 1.20], ropepushdown: [0.25, 0.45, 0.65, 0.85, 1.10], vbarpushdown: [0.30, 0.50, 0.70, 0.95, 1.20], revpushdown: [0.25, 0.40, 0.60, 0.80, 1.05], sapushdown: [0.12, 0.20, 0.30, 0.42, 0.55], cabletrikick: [0.08, 0.14, 0.20, 0.28, 0.36], ohtri: [0.15, 0.28, 0.42, 0.60, 0.80], saoh: [0.08, 0.14, 0.20, 0.28, 0.36], cableoh: [0.25, 0.40, 0.60, 0.80, 1.05], dbskull: [0.08, 0.15, 0.22, 0.30, 0.40], tatepress: [0.08, 0.15, 0.22, 0.30, 0.40], kickback: [0.06, 0.10, 0.15, 0.22, 0.30], machdip: [0.60, 0.90, 1.30, 1.75, 2.25], machtri: [0.40, 0.65, 0.90, 1.25, 1.60],
  smithsquat: [0.75, 1.20, 1.60, 2.20, 2.75], ssbsquat: [0.65, 1.10, 1.40, 1.85, 2.30], hacksquat: [1.00, 1.50, 2.25, 3.00, 3.75], legpress: [1.00, 1.75, 2.50, 3.50, 4.50], horizlegpress: [0.90, 1.50, 2.20, 3.00, 3.90], sllegpress: [0.50, 0.85, 1.25, 1.75, 2.25], beltsquat: [0.75, 1.20, 1.70, 2.30, 2.90], pendulum: [0.80, 1.30, 1.90, 2.60, 3.30], vsquat: [0.90, 1.50, 2.10, 2.90, 3.60], landminesquat: [0.40, 0.65, 0.90, 1.20, 1.50], kbfrontsquat: [0.15, 0.25, 0.35, 0.50, 0.65],
  revlunge: [0.15, 0.30, 0.45, 0.65, 0.85], deficitlunge: [0.15, 0.30, 0.45, 0.65, 0.85], stepup: [0.12, 0.25, 0.40, 0.55, 0.75], curtsy: [0.10, 0.20, 0.32, 0.45, 0.60], latlunge: [0.10, 0.20, 0.32, 0.45, 0.60], sumosquat: [0.25, 0.45, 0.65, 0.90, 1.15], smithlunge: [0.30, 0.55, 0.80, 1.10, 1.45], kblunge: [0.10, 0.20, 0.30, 0.45, 0.60],
  legext: [0.50, 0.90, 1.30, 1.80, 2.30], sllegext: [0.25, 0.45, 0.65, 0.90, 1.15], legcurl: [0.40, 0.70, 1.00, 1.40, 1.80], seatedcurl: [0.45, 0.75, 1.10, 1.50, 1.90], standinglegcurl: [0.20, 0.35, 0.50, 0.70, 0.90], sllegcurl: [0.20, 0.35, 0.50, 0.70, 0.90], slrdl: [0.15, 0.30, 0.45, 0.65, 0.85], smithrdl: [0.70, 1.05, 1.45, 1.90, 2.40], kbrdl: [0.20, 0.35, 0.50, 0.70, 0.90], machhip: [1.00, 1.50, 2.00, 2.75, 3.50], gluteextension: [0.50, 0.80, 1.15, 1.60, 2.00], cablepullthrough: [0.40, 0.65, 0.90, 1.25, 1.60], cablekick: [0.15, 0.25, 0.35, 0.50, 0.65], abduction: [0.40, 0.70, 1.00, 1.40, 1.80], adduction: [0.40, 0.70, 1.00, 1.40, 1.80],
  calf: [0.75, 1.25, 1.90, 2.60, 3.40], seatedcalf: [0.40, 0.70, 1.05, 1.45, 1.90], lpcalf: [1.00, 1.70, 2.50, 3.40, 4.40], donkey: [0.80, 1.30, 1.90, 2.60, 3.40], dbcalf: [0.20, 0.35, 0.50, 0.70, 0.90], smithcalf: [0.80, 1.30, 1.90, 2.60, 3.40],
  kbswing: [0.15, 0.25, 0.35, 0.50, 0.65], kbswing2: [0.15, 0.25, 0.35, 0.50, 0.65], kbclean: [0.15, 0.25, 0.35, 0.50, 0.65], kbcleanpress: [0.12, 0.22, 0.32, 0.45, 0.60], kbthruster: [0.12, 0.22, 0.32, 0.45, 0.60], tgu: [0.10, 0.20, 0.30, 0.42, 0.55], kbwindmill: [0.08, 0.15, 0.22, 0.30, 0.40], dbclean: [0.15, 0.25, 0.35, 0.50, 0.65], manmaker: [0.10, 0.18, 0.25, 0.35, 0.45], devilpress: [0.10, 0.18, 0.25, 0.35, 0.45], logpress: [0.40, 0.60, 0.85, 1.15, 1.50],
  cablecrunch: [0.40, 0.65, 0.95, 1.30, 1.70], machcrunch: [0.40, 0.65, 0.95, 1.30, 1.70], abmachine: [0.40, 0.65, 0.95, 1.30, 1.70], pallof: [0.15, 0.25, 0.35, 0.50, 0.65], woodchop: [0.15, 0.25, 0.35, 0.50, 0.65], sidebend: [0.15, 0.25, 0.40, 0.55, 0.70],
  /* library expansion 2 */
  smithcg: [0.45, 0.65, 0.90, 1.30, 1.75], ngdbbench: [0.20, 0.35, 0.50, 0.70, 0.90], revgripdb: [0.18, 0.30, 0.45, 0.62, 0.80], altdbbench: [0.18, 0.32, 0.46, 0.64, 0.82], incsqueeze: [0.14, 0.25, 0.36, 0.50, 0.64], larsen: [0.45, 0.68, 0.90, 1.35, 1.80],
  pinpress: [0.50, 0.75, 1.00, 1.45, 1.95], slingshot: [0.55, 0.82, 1.10, 1.60, 2.15], tempobench: [0.45, 0.68, 0.90, 1.35, 1.80], inccable: [0.12, 0.22, 0.34, 0.48, 0.65], deccable: [0.12, 0.22, 0.34, 0.48, 0.65], seatedcablefly: [0.15, 0.25, 0.40, 0.55, 0.75],
  sacablepress: [0.15, 0.25, 0.38, 0.52, 0.68], cablecrossover: [0.15, 0.25, 0.40, 0.55, 0.75], lmchestpress: [0.30, 0.50, 0.70, 0.95, 1.25], lmsqueeze: [0.30, 0.50, 0.70, 0.95, 1.25], hsdec: [0.50, 0.80, 1.15, 1.60, 2.05], hswide: [0.45, 0.75, 1.10, 1.55, 2.00],
  convergingpress: [0.45, 0.75, 1.10, 1.55, 2.00], machpullover: [0.40, 0.65, 0.95, 1.30, 1.70], smithfloor: [0.55, 0.80, 1.05, 1.55, 2.05], kbfloorpress: [0.15, 0.28, 0.40, 0.55, 0.72], standingdbfly: [0.08, 0.14, 0.22, 0.32, 0.42], plateloadedfly: [0.35, 0.60, 0.90, 1.25, 1.65],
  deficitdbpress: [0.18, 0.32, 0.46, 0.64, 0.82], hsohp: [0.35, 0.55, 0.80, 1.10, 1.45], smithbtn: [0.32, 0.50, 0.70, 0.90, 1.20], ngdbohp: [0.15, 0.25, 0.35, 0.50, 0.65], altdbohp: [0.14, 0.23, 0.33, 0.47, 0.62], halfkneellm: [0.28, 0.45, 0.65, 0.88, 1.15],
  lmpushpress: [0.35, 0.55, 0.78, 1.05, 1.35], lmlateral: [0.08, 0.14, 0.22, 0.32, 0.42], lmfront: [0.12, 0.20, 0.30, 0.42, 0.55], lmreardelt: [0.30, 0.50, 0.70, 0.95, 1.25], lyinglateral: [0.04, 0.08, 0.13, 0.19, 0.26], luraise: [0.03, 0.06, 0.10, 0.15, 0.20],
  powell: [0.04, 0.08, 0.13, 0.19, 0.26], dbreardeltrow: [0.15, 0.25, 0.38, 0.52, 0.68], cableyraise: [0.08, 0.14, 0.22, 0.32, 0.42], cablereardeltrow: [0.25, 0.40, 0.58, 0.80, 1.05], behindbacklateral: [0.05, 0.10, 0.15, 0.22, 0.30], kneelfacepull: [0.20, 0.35, 0.50, 0.70, 0.90],
  hsreardelt: [0.30, 0.50, 0.75, 1.05, 1.40], machfrontraise: [0.20, 0.35, 0.50, 0.70, 0.90], bottomsup: [0.08, 0.15, 0.22, 0.32, 0.42], dblkbpress: [0.15, 0.25, 0.35, 0.50, 0.65], seesaw: [0.14, 0.23, 0.33, 0.47, 0.62], btbshrug: [0.75, 1.20, 1.70, 2.30, 3.00],
  ohshrug: [0.30, 0.47, 0.68, 0.85, 1.15], kelso: [0.40, 0.60, 0.85, 1.15, 1.50], dbfarmershrug: [0.30, 0.50, 0.75, 1.00, 1.30], machshrug: [0.75, 1.20, 1.70, 2.30, 3.00], platepress: [0.20, 0.35, 0.50, 0.70, 0.90], csreardelt: [0.05, 0.10, 0.15, 0.22, 0.30],
  scottpress: [0.10, 0.18, 0.26, 0.38, 0.50], revgrippulldown: [0.50, 0.75, 1.05, 1.40, 1.75], btnpulldown: [0.45, 0.70, 0.95, 1.30, 1.65], ropepulldown: [0.45, 0.70, 0.95, 1.30, 1.65], kneelpulldown: [0.40, 0.60, 0.85, 1.15, 1.50], ropesapulldown: [0.30, 0.50, 0.70, 0.95, 1.20],
  latprayer: [0.30, 0.50, 0.70, 0.95, 1.20], hspulldown: [0.50, 0.75, 1.00, 1.35, 1.70], hslowrow: [0.50, 0.80, 1.15, 1.55, 2.00], hsfrontpulldown: [0.50, 0.75, 1.00, 1.35, 1.70], cstbar: [0.50, 0.80, 1.15, 1.55, 2.00], machlowrow: [0.50, 0.80, 1.15, 1.55, 2.00],
  helms: [0.20, 0.35, 0.50, 0.68, 0.85], bentdbrow: [0.20, 0.35, 0.50, 0.68, 0.85], kbrow: [0.22, 0.36, 0.50, 0.68, 0.85], gorillarow: [0.22, 0.36, 0.50, 0.68, 0.85], renegaderow: [0.12, 0.22, 0.32, 0.45, 0.60], trapbarrow: [0.50, 0.75, 1.00, 1.30, 1.75],
  standingcablerow: [0.40, 0.60, 0.85, 1.15, 1.50], sasapulldown: [0.15, 0.25, 0.38, 0.52, 0.68], highrowcable: [0.40, 0.60, 0.85, 1.15, 1.50], lmsarow: [0.30, 0.50, 0.70, 0.95, 1.25], lmtbar: [0.50, 0.80, 1.15, 1.55, 2.00], jeffersondl: [0.80, 1.20, 1.60, 2.00, 2.50],
  dbdeadlift: [0.30, 0.50, 0.75, 1.00, 1.30], suitcasedl: [0.20, 0.35, 0.50, 0.70, 0.90], kbsumo: [0.30, 0.50, 0.70, 0.95, 1.25], shotgunrow: [0.25, 0.40, 0.55, 0.75, 0.95], deadstoprow: [0.25, 0.40, 0.55, 0.75, 0.95], wgsealrow: [0.40, 0.60, 0.80, 1.00, 1.40],
  sacablecurl: [0.12, 0.20, 0.30, 0.40, 0.52], lyingcablecurl: [0.25, 0.40, 0.60, 0.80, 1.05], cablepreacher: [0.25, 0.40, 0.60, 0.80, 1.05], cablehammersa: [0.12, 0.20, 0.30, 0.40, 0.52], seateddbcurl: [0.10, 0.18, 0.25, 0.35, 0.45], waiter: [0.15, 0.25, 0.38, 0.52, 0.68],
  revdbcurl: [0.08, 0.14, 0.20, 0.28, 0.36], dbdragcurl: [0.09, 0.16, 0.22, 0.32, 0.40], preacherhammer: [0.09, 0.16, 0.22, 0.32, 0.40], inchammer: [0.08, 0.15, 0.22, 0.30, 0.40], curl21: [0.20, 0.32, 0.45, 0.60, 0.80], strictcurl: [0.22, 0.36, 0.50, 0.68, 0.90],
  cgezcurl: [0.25, 0.40, 0.55, 0.75, 1.00], ezpreacherrev: [0.15, 0.25, 0.35, 0.48, 0.62], spiderez: [0.22, 0.36, 0.50, 0.68, 0.90], machhammer: [0.25, 0.40, 0.60, 0.80, 1.05], kbcurl: [0.10, 0.18, 0.25, 0.35, 0.45], ropeoh: [0.25, 0.40, 0.60, 0.80, 1.05],
  cablelyingext: [0.25, 0.40, 0.60, 0.80, 1.05], crossbodyext: [0.10, 0.18, 0.26, 0.36, 0.48], cablekickbackrope: [0.08, 0.14, 0.20, 0.28, 0.36], bbskull: [0.25, 0.40, 0.55, 0.75, 1.00], incskull: [0.22, 0.36, 0.50, 0.68, 0.90], decskull: [0.25, 0.40, 0.55, 0.75, 1.00],
  bbohext: [0.25, 0.40, 0.55, 0.75, 1.00], seatedohtri: [0.15, 0.28, 0.42, 0.60, 0.80], seateddipmach: [0.60, 0.90, 1.30, 1.75, 2.25], dbfloorskull: [0.08, 0.15, 0.22, 0.30, 0.40], btbwristcurl: [0.25, 0.40, 0.55, 0.75, 1.00], fingercurl: [0.25, 0.40, 0.55, 0.75, 1.00],
  cablewristcurl: [0.10, 0.18, 0.25, 0.35, 0.45], fatgripcurl: [0.08, 0.15, 0.22, 0.30, 0.40], revhack: [0.90, 1.40, 2.00, 2.70, 3.40], hackcalf: [1.00, 1.60, 2.30, 3.10, 4.00], smithfront: [0.60, 1.00, 1.30, 1.70, 2.10], smithsplit: [0.30, 0.55, 0.80, 1.10, 1.45],
  smithhip: [1.00, 1.50, 2.00, 2.75, 3.50], smithgm: [0.30, 0.50, 0.75, 1.00, 1.30], smithsumo: [0.70, 1.15, 1.55, 2.10, 2.65], smithstepup: [0.30, 0.55, 0.80, 1.10, 1.45], legpresswide: [1.00, 1.75, 2.50, 3.50, 4.50], legpressnarrow: [1.00, 1.75, 2.50, 3.50, 4.50],
  legpresshigh: [1.00, 1.75, 2.50, 3.50, 4.50], hslegpress: [1.00, 1.75, 2.50, 3.50, 4.50], lyinglegpress: [0.80, 1.40, 2.00, 2.80, 3.60], kneelinglegcurl: [0.20, 0.35, 0.50, 0.70, 0.90], bstancehip: [0.50, 0.80, 1.10, 1.50, 1.95], dbglutebridge: [0.30, 0.50, 0.75, 1.00, 1.30],
  kbhipthrust: [0.30, 0.50, 0.75, 1.00, 1.30], andersonsquat: [0.65, 1.10, 1.35, 1.80, 2.25], bbsplitsquat: [0.30, 0.60, 0.90, 1.30, 1.70], bbbss: [0.30, 0.60, 0.90, 1.30, 1.70], bbstepup: [0.30, 0.55, 0.80, 1.10, 1.45], bbrevlunge: [0.30, 0.60, 0.90, 1.30, 1.70],
  bbwalklunge: [0.30, 0.60, 0.90, 1.30, 1.70], bbhacksquat: [0.60, 1.00, 1.30, 1.70, 2.10], jeffersonsquat: [0.60, 1.00, 1.30, 1.70, 2.10], snatchrdl: [0.65, 1.00, 1.35, 1.70, 2.15], sumordl: [0.75, 1.10, 1.50, 1.90, 2.40], bbcalf: [0.75, 1.25, 1.90, 2.60, 3.40],
  frontracklunge: [0.30, 0.55, 0.80, 1.10, 1.45], ssbgm: [0.30, 0.50, 0.75, 1.00, 1.30], cossack: [0.10, 0.20, 0.32, 0.45, 0.60], dbsldl: [0.25, 0.45, 0.65, 0.90, 1.15], dbslcalf: [0.15, 0.28, 0.42, 0.58, 0.75], dbjumpsquat: [0.08, 0.15, 0.22, 0.30, 0.40],
  dbfrontsquat: [0.20, 0.35, 0.50, 0.70, 0.90], dbsidelunge: [0.10, 0.20, 0.32, 0.45, 0.60], ohwalklunge: [0.08, 0.15, 0.22, 0.32, 0.42], stepdown: [0.10, 0.20, 0.30, 0.42, 0.55], kbstepup: [0.12, 0.25, 0.40, 0.55, 0.75], dblkbfront: [0.25, 0.45, 0.65, 0.90, 1.15],
  kbgoblet: [0.20, 0.35, 0.50, 0.70, 0.90], kbbss: [0.15, 0.30, 0.45, 0.65, 0.85], kbsldl: [0.15, 0.30, 0.45, 0.65, 0.85], kbcalf: [0.20, 0.35, 0.50, 0.70, 0.90], lmrdl: [0.50, 0.80, 1.10, 1.45, 1.85], lmrevlunge: [0.30, 0.50, 0.70, 0.95, 1.25],
  lmlatlunge: [0.25, 0.40, 0.58, 0.80, 1.05], lmsplit: [0.30, 0.50, 0.70, 0.95, 1.25], lmhack: [0.40, 0.65, 0.90, 1.20, 1.50], lmsumo: [0.40, 0.65, 0.90, 1.20, 1.50], lmsldl: [0.25, 0.40, 0.58, 0.80, 1.05], lmcalf: [0.50, 0.80, 1.10, 1.45, 1.85],
  lmthruster: [0.35, 0.55, 0.78, 1.05, 1.35], lmgoodmorning: [0.30, 0.50, 0.70, 0.95, 1.25], beltsquatmarch: [0.30, 0.50, 0.75, 1.00, 1.30], multihip: [0.40, 0.70, 1.00, 1.40, 1.80], tibmachine: [0.10, 0.20, 0.30, 0.42, 0.55], slegpresscalf: [0.50, 0.85, 1.25, 1.70, 2.20],
  standingcablecrunch: [0.40, 0.65, 0.95, 1.30, 1.70], cablesidebend: [0.15, 0.25, 0.40, 0.55, 0.70], lowtohighchop: [0.15, 0.25, 0.35, 0.50, 0.65], cablereversecrunch: [0.15, 0.25, 0.35, 0.50, 0.65], kneelingpallof: [0.15, 0.25, 0.35, 0.50, 0.65], lmrainbow: [0.30, 0.50, 0.70, 0.95, 1.25],
  lmantirot: [0.30, 0.50, 0.70, 0.95, 1.25], wtddeadbug: [0.05, 0.10, 0.15, 0.22, 0.30], dbwoodchop: [0.08, 0.15, 0.22, 0.32, 0.42], dbrussian: [0.08, 0.15, 0.22, 0.32, 0.42], waitercarry: [0.15, 0.25, 0.35, 0.50, 0.65], zerchercarry: [0.50, 0.80, 1.10, 1.50, 1.95],
  crossbodycarry: [0.15, 0.25, 0.35, 0.50, 0.65], birddogrow: [0.12, 0.22, 0.32, 0.45, 0.60], cleanpress: [0.50, 0.75, 1.00, 1.30, 1.65], squatclean: [0.55, 0.85, 1.15, 1.50, 1.90], hangpowerclean: [0.50, 0.80, 1.10, 1.40, 1.75], musclesnatch: [0.30, 0.47, 0.65, 0.85, 1.10],
  snatchpull: [0.50, 0.80, 1.10, 1.40, 1.75], snatchbalance: [0.40, 0.60, 0.85, 1.10, 1.40], sotspress: [0.20, 0.32, 0.45, 0.60, 0.80], sdhp: [0.45, 0.70, 0.95, 1.25, 1.60], muscleclean: [0.35, 0.55, 0.78, 1.05, 1.35], cluster: [0.40, 0.65, 0.90, 1.20, 1.50],
  groundtooverhead: [0.40, 0.65, 0.90, 1.20, 1.50], dbcleanpress: [0.15, 0.25, 0.35, 0.50, 0.65], dbswing: [0.15, 0.25, 0.35, 0.50, 0.65], dbhangclean: [0.15, 0.25, 0.35, 0.50, 0.65], dbcomplex: [0.10, 0.18, 0.26, 0.36, 0.48], dbboxstepover: [0.10, 0.20, 0.30, 0.42, 0.55],
  altdbsnatch: [0.15, 0.25, 0.35, 0.50, 0.65], kbhighpull: [0.15, 0.25, 0.35, 0.50, 0.65], kbcleansquatpress: [0.12, 0.22, 0.32, 0.45, 0.60], kbdeadclean: [0.15, 0.25, 0.35, 0.50, 0.65], kbjerk: [0.15, 0.25, 0.35, 0.50, 0.65], kblongcycle: [0.15, 0.25, 0.35, 0.50, 0.65],
  axlepress: [0.35, 0.55, 0.80, 1.00, 1.35], circusdb: [0.15, 0.28, 0.40, 0.55, 0.72],
  /* bodyweight lifts: the ladder is the added weight on your best estimated single, as a multiple of body weight */
  pullup: [0.10, 0.25, 0.45, 0.70, 0.95], chinup: [0.10, 0.27, 0.48, 0.72, 1.00], dip: [0.15, 0.35, 0.60, 0.90, 1.20]
};
/* The lifts worth showing before they are logged: the five big patterns plus the machine and dumbbell staples most people run. */
const MAJOR_LIFTS = ['squat', 'bench', 'deadlift', 'ohp', 'row', 'pulldown', 'incbench', 'rdl', 'legpress', 'hipthrust', 'dbbench', 'cablerow', 'pullup'];
const LEVELS = ['Beginner', 'Novice', 'Intermediate', 'Advanced', 'Elite'];
const UPPER = {Chest: 1, Shoulders: 1, Arms: 1, Back: 1};
function stdThresholds(exId){
  const base = STD[exId]; if (!base) return null; const e = ex(exId), p = state.profile; let f = 1;
  if (p.sex === 'f') f *= UPPER[e.group] ? 0.60 : 0.70;
  if (p.age) { if (p.age >= 40) f *= Math.max(0.6, 1 - 0.01 * (p.age - 39)); else if (p.age < 18) f *= 0.85; }
  return base.map(t => t * f);
}
function levelFor(exId, e1){
  const th = stdThresholds(exId), bw = state.profile.bw; if (!th || !bw || !e1) return null;
  const r = e1 / bw; let idx = 0; while (idx < 5 && r >= th[idx]) idx++;
  const lo = idx ? th[idx - 1] : 0, hi = idx < 5 ? th[idx] : null;
  return {idx: idx, label: idx ? LEVELS[idx - 1] : 'Getting started', ratio: r, prog: hi ? clamp((r - lo) / (hi - lo), 0, 1) : 1, next: hi ? {label: LEVELS[idx], lb: hi * bw} : null};
}
const working = sets => sets.filter(s => !s.wu);
const counted = sets => sets.filter(s => !s.wu && !s.tech);
function volumeOf(w){ let v = 0; for (const en of w.entries) { if (ex(en.ex).type !== 'lift') continue; for (const st of working(en.sets)) { v += (st.w || 0) * (st.r || 0); if (st.sub) for (const x of subStages(st.sub)) v += (x.w || 0) * (x.r || 0); } } return v; }
function setsOf(w){ return w.entries.reduce((n, en) => n + (ex(en.ex).type === 'lift' ? working(en.sets).length : 0), 0); }
function cardioOf(w){ let sec = 0, mi = 0; for (const en of w.entries) { if (ex(en.ex).type !== 'cardio') continue; for (const st of en.sets) { sec += st.sec || 0; mi += st.mi || 0; } } return {sec: sec, mi: mi}; }
function sortedWorkouts(){ return state.workouts.slice().sort((a, b) => b.start - a.start); }
/* What the coach learns from: light days stay out, and so does any lift where the lifter overruled the coach. */
const coachWorkouts = () => sortedWorkouts().filter(w => !w.light);
const lightWeekOn = () => !!(state.settings.lightUntil && todayKey() <= state.settings.lightUntil);
function workoutsOn(k){ return state.workouts.filter(w => w.date === k); }
function lastPerformance(exId){
  for (const w of coachWorkouts()) { const en = w.entries.find(e => e.ex === exId && !e.adj && working(e.sets).length); if (en) return {date: w.date, sets: working(en.sets)}; }
  return null;
}
/* Standards for bodyweight lifts count body weight plus added weight, then report the added weight on the estimated single. */
function stdE1rm(exId){ const e = ex(exId); if (!e.bw) return bestE1rm(exId); const bw = state.profile.bw; if (!bw || e.time) return 0; let b = 0; for (const w of state.workouts) for (const en of w.entries) if (en.ex === exId) for (const st of working(en.sets)) { if (!st.r) continue; const v = e1rm(bw + (st.w || 0), st.r) - bw; if (v > b) b = v; } return b; }
function bestE1rm(exId){ let b = 0; if (ex(exId).time) return 0; for (const w of state.workouts) for (const en of w.entries) if (en.ex === exId) for (const st of working(en.sets)) { const v = e1rm(st.w, st.r); if (v > b) b = v; } return b; }
function bestReps(exId){ let b = 0; for (const w of state.workouts) for (const en of w.entries) if (en.ex === exId) for (const st of en.sets) if ((st.r || 0) > b) b = st.r; return b; }
function topSet(sets){ let top = null; for (const st of sets) { const v = e1rm(st.w, st.r); if (v > 0 && (!top || v > top.v)) top = {v: v, w: st.w, r: st.r}; } return top; }
function assignPRs(workouts){
  const sorted = workouts.slice().sort((a, b) => a.start - b.start); const best = {};
  for (const w of sorted) {
    w.prs = [];
    for (const en of w.entries) {
      if (ex(en.ex).type !== 'lift' || ex(en.ex).time) continue;
      const top = topSet(working(en.sets)); if (!top) continue;
      if (best[en.ex] !== undefined && top.v > best[en.ex] + 0.01) w.prs.push({ex: en.ex, w: top.w, r: top.r, e1rm: top.v});
      if (best[en.ex] === undefined || top.v > best[en.ex]) best[en.ex] = top.v;
    }
  }
}
function streakWeeks(){
  const weeks = new Set(state.workouts.map(w => weekStart(w.date)));
  let k = weekStart(todayKey()), n = 0;
  if (!weeks.has(k)) k = keyOf(addDays(dateOf(k), -7));
  while (weeks.has(k)) { n++; k = keyOf(addDays(dateOf(k), -7)); }
  return n;
}
/* Macros: Mifflin-St Jeor resting energy, an activity multiplier, a goal adjustment, then protein by body weight,
   fat as a share of calories with a floor, carbs as the remainder. Estimates for healthy adults, not medical advice. */
const ACTIVITY = [['sed', 'Mostly sitting', 1.2], ['light', 'Light (1 to 3 days)', 1.375], ['mod', 'Moderate (3 to 5 days)', 1.55], ['high', 'Very active (6 to 7)', 1.725], ['ath', 'Athlete or physical job', 1.9]];
/* Goals: calorie multiplier on maintenance, protein in grams per pound of body weight, fat as a share of calories, and the reason. */
const GOALS = [
  ['cut', 'Lose fat', 0.80, 1.0, 0.30, 'About 20% under maintenance. Protein goes highest to hold on to muscle, fat stays moderate for hormones and fullness, and carbs take the cut.'],
  ['maintain', 'Maintain', 1.0, 0.8, 0.30, 'At maintenance. A balanced split: solid protein, about 30% of calories from fat, the rest from carbs.'],
  ['gain', 'Build muscle', 1.10, 0.9, 0.25, 'About 10% over maintenance, enough to build without piling on fat. Carbs go highest here to fuel training, with protein close behind.']
];
function macrosFor(goalId){
  const p = state.profile; if (!p.sex || !p.age || !p.bw || !p.height) return null;
  const kg = p.bw / LB_PER_KG, cm = p.height * 2.54;
  const bmr = 10 * kg + 6.25 * cm - 5 * p.age + (p.sex === 'm' ? 5 : -161);
  const act = ACTIVITY.find(a => a[0] === p.activity) || ACTIVITY[2], goal = GOALS.find(g => g[0] === goalId) || GOALS[1];
  const tdee = bmr * act[2];
  let cal = tdee * goal[2]; cal = Math.max(cal, p.sex === 'm' ? 1500 : 1200);
  const protein = Math.round(goal[3] * p.bw);
  const fat = Math.round(Math.max(0.3 * p.bw, cal * goal[4] / 9));
  const carbs = Math.max(50, Math.round((cal - protein * 4 - fat * 9) / 4));
  cal = Math.round(protein * 4 + fat * 9 + carbs * 4);
  return {bmr: Math.round(bmr), tdee: Math.round(tdee), cal: cal, protein: protein, fat: fat, carbs: carbs, goal: goal, act: act};
}
function macros(){ return macrosFor(state.profile.goal); }
/* ---------- progression engine (double progression, section 7 of the plan) ---------- */
/* Lunges, step-ups and alternating moves count both sides, so reps move in twos. */
function repStep(e){ return e && e.type === 'lift' && !e.time && /lunge|step-?up|alternat|curtsy|skater|split squat|bulgarian|mountain climber|bicycle crunch/i.test(e.name) ? 2 : 1; }
function incFor(e){
  const kg = isKg();
  if (e.bar) return kg ? (BIG_LIFTS[e.id] ? 5 : 2.5) * LB_PER_KG : (BIG_LIFTS[e.id] ? 10 : 5);
  if (e.eq === 'dumbbell' || e.eq === 'kettlebell') return kg ? 2 * LB_PER_KG : 5;
  if (e.eq === 'machine' || e.eq === 'smith') return kg ? 5 * LB_PER_KG : 10;
  return kg ? 2.5 * LB_PER_KG : 5;
}
function roundInc(lb, e){ const step = isKg() ? (e.eq === 'dumbbell' ? 2 : 2.5) * LB_PER_KG : 5; return Math.round(lb / step) * step; }
function historyFor(exId, n){
  const out = [];
  for (const w of coachWorkouts()) { const en = w.entries.find(x => x.ex === exId && !x.adj && working(x.sets).length); if (en) { out.push({date: w.date, start: w.start, sets: working(en.sets).filter(s => !s.tech)}); if (out.length >= n) break; } }
  return out;
}
function workingWeight(sets){ const c = {}; let best = null; for (const s of sets) { const w = s.w || 0; c[w] = (c[w] || 0) + 1; } for (const k in c) { const w = +k; if (!best || c[k] > best.c || (c[k] === best.c && w > best.w)) best = {w: w, c: c[k]}; } return best ? best.w : 0; }
function atW(sess, W){ return sess.sets.filter(s => (s.w || 0) === W); }
function sessionTop(sess, lo, hi, n){ if (!sess) return false; const W = workingWeight(sess.sets), s = atW(sess, W); return s.length >= n && s.every(x => x.r >= hi); }
function recommend(exId, target){
  const e = ex(exId); if (e.type !== 'lift' || e.time) return null;
  const lo = target.reps || 8, amrap = target.hi === 99, hi = amrap ? lo + 2 : Math.max(lo, target.hi || target.reps || 8), n = target.sets || 3;
  const fill = v => Array.from({length: n}, () => v);
  const mk = (w, goals, code, conf, extra) => Object.assign({w: w, goals: goals, code: code, conf: conf, lo: lo, hi: hi}, extra || {});
  const hist = historyFor(exId, 3);
  if (target.fail) {
    /* Every set to failure: the weight holds until the first set reaches twelve, then it steps up. */
    if (!hist.length) { const sw = startingWeight(e); return mk(sw || null, fill(0), sw ? 'FAIL_START' : 'FIRST_SESSION', 'low', {level: state.profile.level}); }
    const lastF = hist[0], Wf = workingWeight(lastF.sets), first = atW(lastF, Wf)[0], fr = first ? first.r : 0;
    if (fr >= 12 && !e.bw) return mk(roundInc(Wf + incFor(e), e), fill(0), 'FAIL_UP', 'high', {W: Wf, first: fr});
    return mk(Wf, fill(0), 'FAIL_HOLD', 'high', {W: Wf, first: fr, last: atW(lastF, Wf).map(s => s.r)});
  }
  if (!hist.length) { const sw = startingWeight(e); return sw ? mk(sw, fill(lo), 'START_LEVEL', 'low', {level: state.profile.level}) : mk(null, fill(lo), 'FIRST_SESSION', 'low'); }
  const last = hist[0], W = workingWeight(last.sets), sets = atW(last, W), inc = incFor(e);
  const days = Math.round((Date.now() - last.start) / 86400000);
  if (days > 42) return mk(roundInc(W * 0.85, e), fill(lo), 'LAYOFF_LONG', 'low', {W: W, days: days});
  if (days > 21) return mk(roundInc(W * 0.90, e), fill(lo), 'LAYOFF', 'low', {W: W, days: days});
  if (days > 14) return mk(W, fill(lo), 'EASE_IN', 'medium', {W: W, days: days});
  const rs = repStep(e);
  const goalsFrom = () => { const g = Array.from({length: n}, (_, i) => clamp(sets[i] ? sets[i].r : lo, lo, hi)); const i = g.findIndex(x => x < hi); if (i >= 0) g[i] = Math.min(hi, g[i] + rs); return g; };
  if (sets.length < 2) return mk(W, goalsFrom(), 'NOT_ENOUGH_DATA', 'low', {W: W});
  /* Beating the goal moves the weight next time, every time. One missing set does not cancel that, and beating it by a lot earns a bigger step. */
  const top = sets.length >= Math.max(2, n - 1) && sets.every(s => s.r >= hi), missed = sets.some(s => s.r < lo);
  if (top) {
    const over = sets.every(s => s.r >= hi + 2), exact = sets.every(s => s.r <= hi);
    if (e.bw && W === 0) return mk(0, fill(over ? hi + 3 : hi + 2), 'BW_MORE_REPS', 'high', {W: W});
    if (W > 0 && inc / W > 0.15 && exact && !sessionTop(hist[1], lo, hi, n)) return mk(W, fill(hi), 'CONSOLIDATE', 'high', {W: W, inc: inc});
    const jump = over ? Math.max(inc, Math.min(2 * inc, roundInc(W * 0.10, e))) : inc;
    return mk(roundInc(W + jump, e), fill(lo), over ? 'BEAT_TOP' : 'HIT_TOP', 'high', {W: W, last: sets.map(s => s.r), jump: jump});
  }
  if (missed) {
    /* A miss is judged by size and by repeats. A rep or two short once: hold the weight. A big miss, or a second miss in a row: drop one step and aim for the top of the range at the lighter weight, then climb back. */
    let streak = 0; for (const s of hist.slice(1)) { if (workingWeight(s.sets) === W && atW(s, W).some(x => x.r < lo)) streak++; else break; }
    if (streak >= 2) { const cutoff = keyOf(addDays(new Date(), -56)); let bestW = W; for (const s of historyFor(exId, 30)) if (s.date >= cutoff) bestW = Math.max(bestW, workingWeight(s.sets)); return mk(Math.max(roundInc(W * 0.90, e), roundInc(bestW * 0.80, e)), fill(hi), 'DELOAD_STALL', 'high', {W: W}); }
    const under = sets.filter(s => s.r < lo), worst = Math.max.apply(null, under.map(s => lo - s.r)), total = sets.reduce((a, s) => a + s.r, 0);
    const big = worst >= Math.max(3, 2 * rs) || (under.length >= 2 && total < lo * n * 0.85) || sets.length < n - 1;
    if (big || streak === 1) {
      const bar = e.bar ? (isKg() ? 20 * LB_PER_KG : 45) : 0, w2 = Math.max(bar, roundInc(W - Math.max(inc, W * 0.05), e));
      if (w2 < W) return mk(w2, fill(hi), 'DROP_BACK', 'high', {W: W, last: sets.map(s => s.r), again: streak === 1});
      return mk(W, fill(lo), 'MISSED_TWICE', 'high', {W: W});
    }
    return mk(W, fill(lo), 'MISSED_ONCE', 'high', {W: W, last: sets.map(s => s.r)});
  }
  const goals = goalsFrom();
  const totals = hist.map(s => workingWeight(s.sets) === W ? atW(s, W).reduce((a, x) => a + x.r, 0) : null);
  const flat = totals.length >= 3 && totals.every(t => t !== null) && totals[0] <= totals[1] && totals[1] <= totals[2];
  if (flat) return mk(W, goals, 'STALLED', 'high', {W: W, suggest: roundInc(W * 0.95, e)});
  return mk(W, goals, 'ADD_REPS', 'high', {W: W});
}
/* Light day: 85% of the coach's weight at the bottom of the rep range (bodyweight moves: three quarters of the reps). The session never enters the coach's history. */
function lightRec(rec, e){
  if (!rec || rec.w === null) return rec;
  const n = rec.goals ? rec.goals.length : 3, fill = v => Array.from({length: n}, () => v), fail = rec.goals && rec.goals[0] === 0;
  if (!rec.w) return Object.assign({}, rec, {goals: fail ? rec.goals : fill(Math.max(1, Math.round((rec.lo || 8) * 0.75))), code: 'LIGHT_BW', base: rec, conf: 'high'});
  const bar = e.bar ? (isKg() ? 20 * LB_PER_KG : 45) : 0;
  return Object.assign({}, rec, {w: Math.max(bar, roundInc(rec.w * 0.85, e)), goals: fail ? rec.goals : fill(rec.lo || 8), code: 'LIGHT', base: rec, conf: 'high'});
}
/* Your call on one lift: hold last session's weight, or take 10% off. Either way the plan stays put, so the next session gets the coach's original numbers again. */
function adjustRec(rec, e, kind, last){
  const base = rec && rec.base ? rec.base : rec; if (!base || base.w === null) return rec;
  const n = base.goals ? base.goals.length : 3, fill = v => Array.from({length: n}, () => v), goals = base.goals && base.goals[0] === 0 ? base.goals : fill(base.lo || 8);
  const bar = e.bar ? (isKg() ? 20 * LB_PER_KG : 45) : 0;
  if (kind === 'hold') { const W = last ? workingWeight(last.sets) : base.w; return Object.assign({}, base, {w: W, goals: goals, code: 'ADJ_HOLD', base: base, adj: 'hold', conf: 'high'}); }
  return Object.assign({}, base, {w: Math.max(bar, roundInc(base.w * 0.9, e)), goals: goals, code: 'ADJ_LIGHT', base: base, adj: 'light', conf: 'high'});
}
function whyLine(r, e){
  const u = wUnit(), w = v => dispW(v) + ' ' + u, list = a => a.join(', '), wk = Math.round((r.days || 0) / 7);
  switch (r.code) {
    case 'FIRST_SESSION': return 'First time logged. Find a weight you can do for ' + r.lo + ' clean reps.';
    case 'START_LEVEL': return 'A starting point for ' + (r.level === 'new' ? 'someone new to lifting' : r.level === 'returning' ? 'a returning lifter' : 'a consistent lifter') + ' at your body weight. Adjust freely.';
    case 'FAIL_START': return 'Every set to failure. A starting weight for your level; find one that gives about 8 to 12 clean reps.';
    case 'FAIL_UP': return 'Your first set to failure reached ' + r.first + ' at ' + w(r.W) + ', so ' + w(r.w) + '. Still every set to failure.';
    case 'FAIL_HOLD': return 'Every set to failure at ' + w(r.W) + ' (last time ' + list(r.last) + '). When the first set reaches 12, the weight goes up.';
    case 'HIT_TOP': return 'You hit ' + list(r.last) + ' at ' + w(r.W) + ', so ' + w(r.w) + '.';
    case 'BEAT_TOP': return 'You beat the top of the range on every set (' + list(r.last) + ' at ' + w(r.W) + '), so a bigger step to ' + w(r.w) + '.';
    case 'CONSOLIDATE': return 'A ' + w(r.inc) + ' jump is big at this weight. One more session at the top first.';
    case 'BW_MORE_REPS': return 'Every set at the top. Try ' + r.goals[0] + 's, or add weight.';
    case 'ADD_REPS': return 'Stay at ' + w(r.W) + ' and try for ' + list(r.goals) + '.';
    case 'MISSED_ONCE': return 'Last time ' + list(r.last) + ' at ' + w(r.W) + ', a rep or two short. Same weight, aim for ' + r.lo + 's; a second miss drops it.';
    case 'MISSED_TWICE': return 'Under the range twice. Hold ' + w(r.W) + ' and rebuild.';
    case 'DROP_BACK': return (r.again ? 'Under the range two sessions running' : 'Last time ' + list(r.last) + ' at ' + w(r.W) + ', well under ' + r.lo) + '. Dropping to ' + w(r.w) + ' and aiming for ' + r.hi + ' on every set, then back up.';
    case 'DELOAD_STALL': return 'Three sessions under the range. Dropping about 10% to rebuild.';
    case 'STALLED': return 'Flat for three sessions. A small back-off (' + w(r.suggest) + ') often breaks it.';
    case 'EASE_IN': return 'Two weeks off. Same weight, bottom of the range.';
    case 'LAYOFF': return wk + ' weeks off. Starting 10% lighter; it comes back fast.';
    case 'LAYOFF_LONG': return wk + ' weeks off. Starting 15% lighter and rebuilding.';
    case 'NOT_ENOUGH_DATA': return 'Only one working set last time. Holding ' + w(r.W) + '.';
    case 'LIGHT': return 'Light day: 85% of the ' + w(r.base.w) + ' the coach had in mind, bottom of the range. Nothing today counts against the plan.';
    case 'LIGHT_BW': return 'Light day: three quarters of the usual reps. Nothing today counts against the plan.';
    case 'ADJ_HOLD': return 'Your call: holding at ' + w(r.w) + ' instead of the coach\'s ' + w(r.base.w) + '. The plan stays where it is.';
    case 'ADJ_LIGHT': return 'Your call: 10% under the coach\'s ' + w(r.base.w) + '. The plan stays where it is.';
  }
  return '';
}
function rangeLabel(t){ return t.fail ? 'to failure' : t.hi === 99 ? t.reps + '+' : (t.hi && t.hi !== t.reps ? t.reps + '-' + t.hi : String(t.reps)); }
const LEVEL_SEED = {new: [0, 0.6], returning: [0, 1.0], consistent: [1, 1.0]};
function startingWeight(e){
  const p = state.profile, th = STD[e.id] ? stdThresholds(e.id) : null, seed = LEVEL_SEED[p.level];
  if (!th || !seed || !p.bw || !p.sex || e.bw) return null;
  const bar = e.bar ? (isKg() ? 20 * LB_PER_KG : 45) : 0;
  return Math.max(bar, roundInc(p.bw * th[seed[0]] * seed[1] * 0.75, e));
}
/* Warm-up ramp: how many sets decides the spacing, the working weight decides the loads, reps fall as the weight climbs.
   Bar lifts never go below the empty bar; bodyweight and timed moves warm up with fewer reps or seconds of the same move. */
const WU_RAMPS = [[], [[0.55, 8]], [[0.5, 8], [0.75, 4]], [[0.4, 10], [0.6, 6], [0.8, 3]], [[0.4, 10], [0.55, 6], [0.7, 4], [0.85, 2]], [[0.35, 10], [0.5, 8], [0.65, 5], [0.8, 3], [0.9, 1]], [[0.3, 10], [0.45, 8], [0.6, 5], [0.7, 4], [0.8, 3], [0.9, 1]]];
function wuCountFor(e, W){
  if (e.type !== 'lift' || e.time || (e.bw && !W)) return 0;
  const bar = e.bar ? (isKg() ? 20 * LB_PER_KG : 45) : 0;
  if (!W || W < bar + (isKg() ? 15 * LB_PER_KG : 30)) return 0;
  return W < 95 ? 1 : W < 135 ? 2 : W < 225 ? 3 : W < 315 ? 4 : 5;
}
function warmupRamp(e, W, n, target){
  n = Math.max(0, Math.round(n || 0)); if (!n) return [];
  const frac = k => n === 1 ? 0.5 : 0.35 + 0.45 * k / (n - 1);
  if (e.time) return Array.from({length: n}, (_, k) => ({w: 0, r: Math.max(5, Math.round((target || 20) * frac(k) / 5) * 5)}));
  if (e.bw && !W) return Array.from({length: n}, (_, k) => ({w: 0, r: Math.max(1, Math.round((target || 8) * frac(k)))}));
  if (!W) return [];
  const bar = e.bar ? (isKg() ? 20 * LB_PER_KG : 45) : 0, ramp = WU_RAMPS[Math.min(n, WU_RAMPS.length - 1)], inc = incFor(e);
  const rows = ramp.map(x => ({w: Math.max(bar, roundInc(W * x[0], e)), r: x[1]}));
  for (let k = 0; k < rows.length; k++) {
    if (k && rows[k].w <= rows[k - 1].w) rows[k].w = rows[k - 1].w + inc;
    if (rows[k].w >= W) rows[k].w = Math.max(bar, W - inc);
  }
  return rows;
}
function warmupScheme(e, W){ return warmupRamp(e, W, wuCountFor(e, W)); }
const TECHS = [['', 'None'], ['drop', 'Drop set'], ['restpause', 'Rest-pause'], ['cluster', 'Cluster'], ['myo', 'Myo-reps'], ['partials', 'Partials'], ['other', 'Other']];
const techName = t => (TECHS.find(x => x[0] === t) || ['', t === 'half' ? 'Half weight' : t])[1];
/* A technique is a sub-set attached to the set being logged: it counts as part of that set, with its own weight and reps. */
function subFor(tech, d, e){
  if (!tech) return null;
  if (tech === 'restpause') { const r0 = d.r || 8; return {tech: tech, w: d.w, r: Math.max(1, Math.round(r0 * 0.4)), more: [{w: d.w, r: Math.max(1, Math.round(r0 * 0.3))}]}; }
  const w = tech === 'drop' ? roundInc(Math.max(0, d.w * 0.8), e) : d.w; const r = tech === 'drop' || tech === 'partials' || tech === 'other' ? Math.max(1, Math.round(d.r || 8)) : 3; return {tech: tech, w: w, r: r, more: []};
}
/* Drop sets can chain: each further drop starts from the stage before it, 80% of the weight and the same reps, until someone types over it. */
const subStages = sub => sub ? [sub].concat(sub.more || []) : [];
/* A set meets its goal when the reps are there, or when a heavier weight than planned works out to at least the same estimated single. */
function goalMet(s){ if (!s.tr) return false; if (s.r >= s.tr) return true; return !!(s.tw && s.w > s.tw + 0.01 && e1rm(s.w, s.r) >= e1rm(s.tw, s.tr) - 0.01); }
function subRefresh(sub, d, e){
  if (!sub) return;
  if (sub.tech === 'restpause') { subStages(sub).forEach(s => { if (!s.manualW) s.w = d.w; }); return; }
  if (sub.tech !== 'drop') return;
  const st = subStages(sub);
  st.forEach((s, k) => { const prev = k ? st[k - 1] : d; if (!s.manualW) s.w = roundInc(Math.max(0, prev.w * 0.8), e); if (!s.manualR) s.r = Math.max(1, Math.round(prev.r || 8)); });
}
function subAdd(sub, d, e){ if (!sub || subStages(sub).length >= 5) return; sub.more = sub.more || []; const st = subStages(sub), prev = st[st.length - 1]; sub.more.push(sub.tech === 'restpause' ? {w: d.w, r: Math.max(1, Math.round((prev.r || 2) * 0.75))} : {w: 0, r: 0}); subRefresh(sub, d, e); }
function subLabel(sub, time){ const u = time ? ' s' : ''; return techName(sub.tech).toLowerCase() + ' ' + subStages(sub).map(s => (s.w ? dispW(s.w) : 'BW') + '×' + s.r + u).join(' → '); }
const TEMPOS = ['', '2-0-2', '3-0-1', '3-1-1', '4-0-1', '2-1-2', '5-0-1', '1-0-1'];
function elapsedSec(a){ return ((a.pausedAt || Date.now()) - a.start - (a.pausedTotal || 0)) / 1000; }
const REST_OPTIONS = [30, 45, 60, 75, 90, 105, 120, 150, 180, 210, 240, 300];
const BIG_LIFTS = {squat: 1, highbar: 1, lowbar: 1, frontsquat: 1, boxsquat: 1, pausesquat: 1, pinsquat: 1, zercher: 1, ohsquat: 1, ssbsquat: 1, smithsquat: 1, hacksquat: 1, pendulum: 1, vsquat: 1, deadlift: 1, sumo: 1, trapbar: 1, trapbarhigh: 1, deficitdl: 1, pausedl: 1, blockpull: 1, snatchdl: 1, rackpull: 1, rdl: 1, sldl: 1, trapbarrdl: 1, goodmorning: 1, seatedgm: 1, hipthrust: 1, bbglutebridge: 1, legpress: 1, horizlegpress: 1, bblunge: 1, powerclean: 1, hangclean: 1, cleanjerk: 1, snatch: 1, cleanpull: 1, powersnatch: 1, hangsnatch: 1, splitjerk: 1, pushjerk: 1, thruster: 1};
const round15 = s => Math.max(15, Math.round(s / 15) * 15);
/* Rest between sets for an exercise: a per-exercise choice if the user made one, otherwise a sensible default
   built from the You-page base (big lower-body lifts 2x, other barbell lifts 1.33x, arms and core 0.67x). */
function restFor(exId){
  const o = state.exRest && state.exRest[exId]; if (o) return o;
  const e = ex(exId); if (e.type === 'cardio') return 0;
  const base = state.settings.rest;
  if (BIG_LIFTS[e.id]) return round15(base * 2);
  if (e.bar) return round15(base * 4 / 3);
  if (e.group === 'Arms' || e.group === 'Core') return round15(base * 2 / 3);
  return base;
}
const WU_REST_OPTIONS = [[0, 'Off'], [30, '0:30'], [45, '0:45'], [60, '1:00'], [90, '1:30'], [120, '2:00']];
/* Rest between warm-up sets: a per-exercise choice, otherwise the default from Settings (shorter than working rest). */
function wuRestFor(exId){ const o = state.exWuRest && state.exWuRest[exId]; return o !== undefined ? o : state.settings.wuRest; }
function wuRestOptionsHTML(cur){ return WU_REST_OPTIONS.map(o => '<option value="' + o[0] + '"' + (o[0] === cur ? ' selected' : '') + '>' + o[1] + '</option>').join(''); }
function restOptionsHTML(exId){
  const cur = restFor(exId); const opts = REST_OPTIONS.indexOf(cur) >= 0 ? REST_OPTIONS : REST_OPTIONS.concat([cur]).sort((a, b) => a - b);
  return opts.map(s => '<option value="' + s + '"' + (s === cur ? ' selected' : '') + '>' + mmss(s) + '</option>').join('');
}
/* A day can carry more than one routine; planned days count once. */
function dayPlan(d){ return (state.plan[d] || []).map(id => routine(id)).filter(Boolean); }
/* A repeating order ignores weekdays: day 1, day 2, ... then back to day 1, anchored to a start date you can move by saying which day today is. */
const cycleOn = () => !!(state.cycle && state.cycle.on && state.cycle.seq.length);
function cycleIndex(k){ const c = state.cycle, n = c.seq.length; return ((daysBetween(c.start, k) % n) + n) % n; }
function planFor(k){ if (cycleOn()) return (state.cycle.seq[cycleIndex(k)] || []).map(id => routine(id)).filter(Boolean); return dayPlan(dateOf(k).getDay()); }
function plannedPerWeek(){ if (cycleOn()) { const c = state.cycle; return Math.round(7 * c.seq.filter(s => s.some(id => routine(id))).length / c.seq.length); } return [0, 1, 2, 3, 4, 5, 6].filter(d => dayPlan(d).length).length; }
/* The weekly target: a goal you set, otherwise the days on the plan. */
const goalDays = () => state.settings.goalDays || 0;
function weeklyTarget(){ return goalDays() || plannedPerWeek(); }
function suggestion(exId, last, target){
  if (!last || !target.reps) return null;
  const e = ex(exId); if (e.time || (e.bw && !last.sets.some(s => s.w > 0))) return null;
  const hit = last.sets.length >= (target.sets || 1) && last.sets.every(s => (s.r || 0) >= target.reps);
  if (!hit) return null;
  const topW = Math.max.apply(null, last.sets.map(s => s.w || 0));
  const bump = isKg() ? (e.group === 'Legs' ? 5 : 2.5) * LB_PER_KG : (e.group === 'Legs' ? 10 : 5);
  return topW + bump;
}

/* ---------- athlete score: 0 to 100, strength 40 + cardio 30 + consistency 30 ----------
   Strength: best lift in the last 12 weeks in each of five movement patterns, scored on the standards ladder (0 to 5), 8 points per pattern.
   Cardio: 20 points for weekly load over 4 weeks (minutes x METs, full at 1,000 MET-min, the top of the WHO range) + 10 for the hardest
   session of 10 min or more in 8 weeks (4 METs = 0, 14 METs = 10, adjusted for sex and age).
   Consistency: workout days against planned days over the last 4 weeks (3 a week assumed when no plan is set). */
const PATTERNS = [
  ['squat', 'Squat', ['squat', 'highbar', 'lowbar', 'frontsquat', 'boxsquat', 'pausesquat', 'pinsquat', 'zercher', 'ohsquat', 'goblet', 'dbsquat', 'bss', 'splitsquat', 'lunge', 'bblunge', 'thruster', 'dbthruster', 'andersonsquat', 'bbsplitsquat', 'bbbss', 'bbstepup', 'bbrevlunge', 'bbwalklunge', 'frontracklunge', 'bbhacksquat', 'jeffersonsquat', 'dbfrontsquat', 'kbgoblet', 'dblkbfront', 'kbbss', 'cluster']],
  ['hinge', 'Hinge', ['deadlift', 'sumo', 'trapbar', 'trapbarhigh', 'deficitdl', 'pausedl', 'blockpull', 'snatchdl', 'rdl', 'sldl', 'trapbarrdl', 'goodmorning', 'seatedgm', 'hipthrust', 'bbglutebridge', 'dbhipthrust', 'dbrdl', 'kbdeadlift', 'powerclean', 'hangclean', 'cleanjerk', 'snatch', 'cleanpull', 'powersnatch', 'hangsnatch', 'splitjerk', 'pushjerk', 'snatchrdl', 'sumordl', 'bstancehip', 'jeffersondl', 'dbdeadlift', 'suitcasedl', 'kbsumo', 'dbsldl', 'kbsldl', 'dbglutebridge', 'kbhipthrust', 'cleanpress', 'squatclean', 'hangpowerclean', 'snatchpull', 'sdhp', 'muscleclean', 'musclesnatch']],
  ['push', 'Push', ['bench', 'incbench', 'cgbench', 'decbench', 'wgbench', 'pausebench', 'spoto', 'floorpress', 'jmpress', 'dbbench', 'incdb', 'decdb', 'dbfloor', 'sadbbench', 'larsen', 'pinpress', 'slingshot', 'tempobench', 'ngdbbench', 'revgripdb', 'altdbbench', 'deficitdbpress', 'kbfloorpress']],
  ['overhead', 'Overhead', ['ohp', 'seatedohp', 'pushpress', 'zpress', 'btnpress', 'dbohp', 'seateddbohp', 'sadbohp', 'dbpushpress', 'arnold', 'kbpress', 'dbsnatch', 'kbsnatch', 'ngdbohp', 'altdbohp', 'halfkneellm', 'lmpushpress', 'dblkbpress', 'seesaw', 'bottomsup', 'platepress', 'axlepress', 'circusdb', 'dbcleanpress']],
  ['pull', 'Pull', ['row', 'pendlay', 'yates', 'sealrow', 'dbrow', 'dbsealrow', 'kroc', 'incdbrow', 'helms', 'bentdbrow', 'kbrow', 'gorillarow', 'trapbarrow', 'lmsarow', 'lmtbar', 'deadstoprow', 'wgsealrow', 'renegaderow']]
];
const MET_DEFAULT = {run: 9.8, treadmill: 9.8, sprints: 12, trailrun: 9.5, walk: 3.8, tmwalk: 3.8, inclinewalk: 6.5, hike: 6, ruck: 5, tmruck: 5, bike: 6.8, spinbike: 8.5, recumbent: 5.5, roadbike: 8, mtb: 8.5, assaultbike: 8, rower: 7, skierg: 7, stairs: 9, stepmill: 9, stepper: 7, versaclimber: 9, arctrainer: 6, elliptical: 5, swim: 7, openswim: 8, kayak: 5, paddleboard: 6, rollerblade: 7, xcski: 9, snowshoe: 7.5, jumprope: 11, jumpingjacks: 8, sledpush: 8, sledpull: 8, sleddrag: 8, ropes: 8, hiit: 8.5, circuit: 8, boxing: 7.8, kickboxing: 8.5, martialarts: 8, basketball: 6.5, soccer: 7, tennis: 7.3, pickleball: 4.5, volleyball: 4, hockey: 8, golfwalk: 4.8, climbing: 8, yoga: 2.5, pilates: 3, mobility: 2.5, dance: 5.5,
  curvedtm: 10, walkingpad: 3, tmsprints: 12, hillsprints: 12, tempo: 11, trackintervals: 11.5, longrun: 9.5, recoveryrun: 7, fartlek: 10, stadiumstairs: 9, powerwalk: 4.5, treadmillhike: 6.5, jacobsladder: 9, ube: 4.5, rowerintervals: 9, bikeintervals: 9, bikeerg: 7, doubleunders: 11.5, shadowboxing: 6, heavybag: 7.5, speedbag: 5, rebounder: 4.5, metcon: 9, bootcamp: 8, barre: 3.5, spinclass: 8.5, aquajog: 6, waterpolo: 9, surfing: 5, wakeboard: 5, waterski: 6, wakesurf: 5, canoe: 4.5, rowingwater: 7, sailing: 3.5, snorkel: 5, football: 7, baseball: 4.5, lacrosse: 8, rugby: 8.5, racquetball: 7, badminton: 5.5, tabletennis: 4, skiing: 6, snowboarding: 5.5, iceskating: 6.5, ultimate: 7, discgolf: 3.5, bjj: 8, wrestling: 9, mma: 9, trackfield: 8, skateboarding: 5, foamroll: 2, hotyoga: 3.5, taichi: 3, walkdog: 3.3, yardwork: 4.5, pickupgame: 6.5};
const RUN_IDS = {run: 1, treadmill: 1, sprints: 1, trailrun: 1, curvedtm: 1, tmsprints: 1, hillsprints: 1, tempo: 1, trackintervals: 1, longrun: 1, recoveryrun: 1, fartlek: 1}, WALK_IDS = {walk: 1, tmwalk: 1, inclinewalk: 1, hike: 1, ruck: 1, tmruck: 1, walkingpad: 1, powerwalk: 1, treadmillhike: 1, walkdog: 1};
/* Carried load: rucks log a pack weight, and the energy cost scales with body weight plus pack. */
const LOAD_IDS = {ruck: 1, tmruck: 1};
function loadFactor(load){ if (!load) return 1; const bw = state.profile.bw || 180; return clamp((bw + load) / bw, 1, 1.6); }
const LEVEL_SHORT = ['Start', 'Beginner', 'Novice', 'Interm.', 'Advanced', 'Elite'];
const BANDS = [[85, 'Elite'], [70, 'Advanced'], [50, 'Established'], [30, 'Building'], [0, 'Starting out']];
const daysBetween = (a, b) => Math.round((dateOf(b) - dateOf(a)) / 86400000);
const dayBefore = (k, n) => keyOf(addDays(dateOf(k), -n));
/* Intensity of one cardio set in METs. Walks and runs use the ACSM walking and running equations from speed and grade;
   anything without a speed gets a typical value for the activity. */
function metsOf(exId, s){
  const e = ex(exId);
  let mph = 0;
  if (s.mi && s.sec) mph = s.mi / (s.sec / 3600);
  else if (s.speed) mph = isKg() ? s.speed / KM_PER_MI : s.speed;
  if (mph > 0 && (RUN_IDS[e.id] || WALK_IDS[e.id] || e.eq === 'treadmill')) {
    const v = mph * 26.8224, grade = (s.incline || 0) / 100;
    const walking = WALK_IDS[e.id] ? mph < 5 : mph < 4;
    const vo2 = walking ? 3.5 + 0.1 * v + 1.8 * v * grade : 3.5 + 0.2 * v + 0.9 * v * grade;
    return clamp(vo2 / 3.5 * loadFactor(s.load), 2, 20);
  }
  return (MET_DEFAULT[e.id] || 5) * loadFactor(s.load);
}
function setLoad(exId, s){
  if (s.ivl && ivlPhases(s.ivl).length) { let rem = (s.sec || 0) / 60, min = 0, load = 0, k = 0; const ph = ivlPhases(s.ivl); while (rem > 1e-6 && k < 4000) { const p = ph[k % ph.length], m = Math.min(p.min, rem); if (m > 0) { load += m * metsOf(exId, {speed: p.speed, incline: p.incline, load: s.load}); min += m; } rem -= m; k++; } return {min: min, load: load}; }
  const m = (s.sec || 0) / 60; return {min: m, load: m * metsOf(exId, s)};
}
function cardioEntry(en){ let min = 0, load = 0; for (const s of en.sets) { const l = setLoad(en.ex, s); if (!l.min) continue; min += l.min; load += l.load; } return {min: min, load: load, mets: min ? load / min : 0}; }
/* Interval schedules for treadmill cards: a list of stages (minutes, speed, incline) repeated for a number of rounds.
   Two stages is the classic hard/easy; more stages make an incline ladder. Older logs kept stages as a and b. */
const IVL_MINUTES = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 6, 7, 8, 10, 12, 15];
function ivlPhases(v){ if (!v) return []; if (!v.ph || !v.ph.length) v.ph = [v.a, v.b].filter(Boolean).map(p => Object.assign({}, p)); return v.ph; }
const ivlCycleMin = v => ivlPhases(v).reduce((n, p) => n + p.min, 0);
function ivlTotalSec(v){ return Math.round(v.rounds * ivlCycleMin(v) * 60); }
function ivlAt(v, sec){
  const ph = ivlPhases(v), cyc = ivlCycleMin(v) * 60; if (cyc <= 0 || !ph.length) return null;
  const total = ivlTotalSec(v); if (sec >= total) return {done: true, idx: ph.length * v.rounds, round: v.rounds};
  const round = Math.floor(sec / cyc); let r = sec - round * cyc, k = 0;
  while (k < ph.length - 1 && r >= ph[k].min * 60) { r -= ph[k].min * 60; k++; }
  return {done: false, k: k, phase: k, stage: ph[k], next: ph[(k + 1) % ph.length], nextRound: k === ph.length - 1, round: round + 1, into: r, left: ph[k].min * 60 - r, idx: round * ph.length + k};
}
function ivlDistanceMi(v, sec){ const ph = ivlPhases(v); let rem = sec / 60, dist = 0, k = 0; while (rem > 1e-6 && k < 4000 && ph.length) { const p = ph[k % ph.length], m = Math.min(p.min, rem); dist += p.speed * m / 60; rem -= m; k++; } return toMi(Math.round(dist * 100) / 100); }
const fmtMin = m => (m % 1 ? m.toFixed(1) : String(m)) + ' min';
function ivlLabel(v){ const u = isKg() ? 'km/h' : 'mph', ph = ivlPhases(v); return v.rounds + ' × (' + ph.map(p => fmtMin(p.min) + ' at ' + p.speed + ' ' + u + ' ' + p.incline + '%').join(' + ') + ')'; }
function ivlAvg(v){ const ph = ivlPhases(v), cyc = ivlCycleMin(v) || 1; return {speed: Math.round(ph.reduce((n, p) => n + p.speed * p.min, 0) / cyc * 10) / 10, incline: Math.round(ph.reduce((n, p) => n + p.incline * p.min, 0) / cyc * 10) / 10}; }
function ivlCopy(v){ return {ph: ivlPhases(v).map(p => Object.assign({}, p)), rounds: v.rounds}; }
/* Cardio that can be done on a treadmill: the two treadmill exercises always, and any run, walk, hike or sprint (or a custom cardio) by choice. */
const NO_TM = {stadiumstairs: 1, yardwork: 1, walkdog: 1};
function tmEligible(e){ return e.type === 'cardio' && e.eq !== 'treadmill' && !NO_TM[e.id] && (e.eq === 'outdoors' || (e.id.indexOf('c_') === 0 && (!e.eq || e.eq === 'outdoors' || e.eq === 'other'))); }
function onTreadmill(en){ const e = ex(en.ex); return e.eq === 'treadmill' || (tmEligible(e) && !!(en.draft && en.draft.tm)); }
const RUNNY = {treadmill: 1, run: 1, sprints: 1, trailrun: 1, curvedtm: 1, tmsprints: 1, hillsprints: 1, tempo: 1, trackintervals: 1, longrun: 1, recoveryrun: 1, fartlek: 1};
function tmDefaultSpeed(e){ const kg = isKg(); return RUNNY[e.id] ? (kg ? 9.7 : 6) : (kg ? 4.8 : 3); }
function ivlDefaults(e){ const kg = isKg(); return RUNNY[e.id] ? {on: false, ph: [{min: 3, speed: kg ? 11 : 7, incline: 1}, {min: 2, speed: kg ? 5.5 : 3.5, incline: 1}], rounds: 6} : {on: false, ph: [{min: 3, speed: kg ? 5.6 : 3.5, incline: 10}, {min: 2, speed: kg ? 4.8 : 3, incline: 4}], rounds: 8}; }
function cardioFactor(){ const p = state.profile; let f = 1; if (p.sex === 'f') f *= 0.88; if (p.age && p.age >= 40) f *= Math.max(0.6, 1 - 0.01 * (p.age - 39)); return f; }
function levelPoints(exId, e1){ const l = levelFor(exId, e1); if (!l) return null; return l.idx >= 5 ? 5 : l.idx + l.prog; }
function strengthScore(asOf){
  const p = state.profile; if (!p.bw || !p.sex) return {ok: !liftOn(), pts: 0, max: 40, patterns: []};
  const from = dayBefore(asOf, 83), best = {};
  for (const w of state.workouts) { if (w.date < from || w.date > asOf) continue; for (const en of w.entries) { if (!STD[en.ex]) continue; for (const st of working(en.sets)) { const v = e1rm(st.w, st.r); if (v > (best[en.ex] ? best[en.ex].e1 : 0)) best[en.ex] = {e1: v, w: st.w, r: st.r, date: w.date}; } } }
  const patterns = PATTERNS.map(pt => {
    let top = null;
    for (const id of pt[2]) { const b = best[id]; if (!b) continue; const L = levelPoints(id, b.e1); if (L !== null && (!top || L > top.L)) top = {ex: id, L: L, e1: b.e1, w: b.w, r: b.r, date: b.date, lv: levelFor(id, b.e1)}; }
    return {key: pt[0], label: pt[1], example: pt[2][0], top: top, pts: top ? 8 * top.L / 5 : 0};
  });
  return {ok: true, pts: patterns.reduce((a, x) => a + x.pts, 0), max: 40, patterns: patterns};
}
function cardioScore(asOf){
  const from28 = dayBefore(asOf, 27), from56 = dayBefore(asOf, 55), since = state.since || asOf;
  const weeks = clamp((daysBetween(since, asOf) + 1) / 7, 1, 4);
  let load = 0, minutes = 0, sessions = 0, peak = null;
  for (const w of state.workouts) {
    if (w.date > asOf || w.date < from56) continue;
    for (const en of w.entries) {
      if (ex(en.ex).type !== 'cardio') continue; const c = cardioEntry(en); if (!c.min) continue;
      if (w.date >= from28) { load += c.load; minutes += c.min; sessions++; }
      if (c.min >= 10 && (!peak || c.mets > peak.mets)) peak = {mets: c.mets, ex: en.ex, date: w.date, min: c.min};
    }
  }
  const weekly = load / weeks, loadPts = 20 * clamp(weekly / 1000, 0, 1);
  const peakAdj = peak ? peak.mets / cardioFactor() : 0, peakPts = 10 * clamp((peakAdj - 4) / 10, 0, 1);
  return {pts: loadPts + peakPts, max: 30, loadPts: loadPts, peakPts: peakPts, weekly: weekly, weeklyMin: minutes / weeks, sessions: sessions, weeks: weeks, peak: peak, peakAdj: peakAdj, avgMets: minutes ? load / minutes : 0};
}
function consistencyScore(asOf){
  const since = state.since || asOf, start = dayBefore(asOf, 27), from = since > start ? since : start;
  const n = daysBetween(from, asOf) + 1, perWeek = plannedPerWeek(), goal = goalDays();
  let planned = 0; for (let i = 0; i < n; i++) if (planFor(keyOf(addDays(dateOf(from), i))).length) planned++;
  if (goal) planned = goal * n / 7;
  const usingDefault = !perWeek && !goal; if (usingDefault) planned = 3 * n / 7;
  const days = new Set(state.workouts.filter(w => w.date >= from && w.date <= asOf).map(w => w.date)).size;
  const adherence = planned ? clamp(days / planned, 0, 1) : 0;
  return {pts: 30 * adherence, max: 30, days: days, planned: Math.max(1, Math.round(planned)), adherence: adherence, usingDefault: usingDefault, n: n};
}
function scoreBand(t){ return BANDS.find(b => t >= b[0])[1]; }
function scoreAsOf(asOf){
  const s = strengthScore(asOf), c = cardioScore(asOf), k = consistencyScore(asOf);
  const total = s.ok ? clamp(Math.round(s.pts + c.pts + k.pts), 0, 100) : null;
  return {asOf: asOf, total: total, strength: s, cardio: c, consistency: k, band: total === null ? null : scoreBand(total)};
}
function athleteScore(){ return scoreAsOf(todayKey()); }
function scoreHistory(){
  const cur = weekStart(todayKey()), since = state.since || todayKey(), out = [];
  for (let i = 11; i >= 0; i--) { const ws = keyOf(addDays(dateOf(cur), -7 * i)), end = i === 0 ? todayKey() : keyOf(addDays(dateOf(ws), 6)); if (end < since) continue; const sc = scoreAsOf(end); if (sc.total !== null) out.push({x: end, y: sc.total}); }
  return out;
}
function scoreDelta(){ const since = state.since || todayKey(), back = dayBefore(todayKey(), 28); if (back < since) return null; const then = scoreAsOf(back).total, now = athleteScore().total; return then === null || now === null ? null : now - then; }
const gainLabel = g => '+' + Math.max(1, Math.round(g));
/* The levers: what would raise the score most, one sentence each. */
function scoreLevers(sc){
  const out = [], s = sc.strength, c = sc.cardio, k = sc.consistency, u = wUnit();
  if (s.ok) {
    let weakest = null; for (const p of s.patterns) if (!weakest || p.pts < weakest.pts) weakest = p;
    if (weakest && !weakest.top) out.push({k: 'strength', gain: 3.2, text: 'No ' + weakest.label.toLowerCase() + ' pattern lift in 12 weeks. Log one (' + ex(weakest.example).name + ', for example): up to +8.'});
    else if (weakest && weakest.top.L < 5) { const t = weakest.top, nextL = Math.floor(t.L + 1e-9) + 1, gain = (nextL - t.L) * 1.6; out.push({k: 'strength', gain: gain, text: weakest.label + ' is your lowest pattern: ' + t.lv.label.toLowerCase() + ' at ' + t.lv.ratio.toFixed(2) + '× body weight on ' + ex(t.ex).name + '. ' + (t.lv.next ? t.lv.next.label + ' (' + dispW(Math.round(t.lv.next.lb)) + ' ' + u + ' est. 1RM) adds ' + gainLabel(gain) + '.' : '')}); }
  }
  if (c.loadPts < 20) {
    const mets = c.avgMets || 9.8, gain = Math.min(20 - c.loadPts, 20 * mets * 30 / 1000);
    out.push({k: 'cardio', gain: gain, text: c.sessions ? 'Averaging ' + Math.round(c.weeklyMin) + ' min of cardio a week. One more 30-minute session each week adds about ' + gainLabel(gain) + '.' : 'No cardio in the last 4 weeks. One 30-minute run a week adds about ' + gainLabel(gain) + '.'});
  } else if (c.peakPts < 10) out.push({k: 'cardio', gain: Math.min(2, 10 - c.peakPts), text: 'Weekly load is maxed. Harder sessions raise the peak: about +1 per MET.'});
  if (k.adherence < 1) { const gain = 30 - k.pts; out.push({k: 'consistency', gain: gain, text: k.days + ' of ' + k.planned + ' planned days in the last ' + (k.n >= 28 ? '4 weeks' : k.n + ' days') + '. Hitting every planned day adds ' + gainLabel(gain) + '.'}); }
  return out.filter(l => (l.k === 'strength' ? liftOn() : l.k === 'cardio' ? cardioOn() : true)).sort((a, b) => b.gain - a.gain);
}

/* Strength standing: with the athlete score turned off, Progress and Today lead with the standards instead.
   Overall level is the average of each logged standards lift's level (beginner 1 to elite 5, with progress toward the next rung),
   and the next standard is the lift closest, in percent, to its next rung. */
const scoreOn = () => state.settings.score !== false;
function strengthStanding(){
  const p = state.profile, ok = !!(p.bw && p.sex);
  const rows = Object.keys(STD).map(id => ({id: id, e1: stdE1rm(id)})).filter(r => r.e1 > 0);
  const out = {ok: ok, rows: rows, ranked: [], level: null, label: null, next: null, at: 0};
  if (!ok || !rows.length) return out;
  out.ranked = rows.map(r => Object.assign({lv: levelFor(r.id, r.e1)}, r)).filter(r => r.lv).sort((a, b) => (b.lv.idx + b.lv.prog) - (a.lv.idx + a.lv.prog));
  if (!out.ranked.length) return out;
  const mean = out.ranked.reduce((a, r) => a + Math.min(5, r.lv.idx + r.lv.prog), 0) / out.ranked.length;
  out.level = clamp(Math.floor(mean + 1e-9), 0, 5);
  out.label = out.level ? LEVELS[out.level - 1] : 'Getting started';
  out.at = out.ranked.filter(r => r.lv.idx >= out.level).length;
  for (const r of out.ranked) { if (!r.lv.next) continue; const gap = r.lv.next.lb - r.e1, pct = gap / r.e1; if (!out.next || pct < out.next.pct) out.next = {id: r.id, gap: gap, pct: pct, label: r.lv.next.label, lb: r.lv.next.lb, e1: r.e1, lv: r.lv}; }
  return out;
}
function nextStandardLine(st, short){
  const n = st.next; if (!n) return st.ranked.length ? 'Every lift is at the top of the ladder.' : '';
  const name = ex(n.id).name + (ex(n.id).bw ? ' (added weight)' : ''), gap = dispW(Math.max(1, Math.round(n.gap))), u = wUnit();
  return short ? name + ': ' + gap + ' ' + u + ' to ' + n.label.toLowerCase() : name + ' is closest: ' + gap + ' ' + u + ' more on your estimated max reaches ' + n.label.toLowerCase() + ' (' + dispW(Math.round(n.lb)) + ' ' + u + ').';
}

/* ---------- how to do it: set-up and movement cues, plus one pro tip for the mind-muscle connection ----------
   TIPS[id] = [setup, movement, protip]. Anything without an entry gets cues built from its pattern, equipment and muscle group. */
const TIPS = {
  squat: ['Bar on the traps or rear delts, hands just outside the shoulders, elbows under the bar. Feet shoulder width, toes out a touch. Big breath into the belly, brace like someone is about to poke you.', 'Sit down and back between the hips, knees tracking over the toes, chest up. Go as deep as your hips allow with a flat back, then drive the floor away. Stand all the way up before the next rep.', 'Think "spread the floor" with your feet on the way up. It wakes up the glutes and keeps the knees from caving.'],
  highbar: ['Bar high on the traps, elbows pointed down, chest tall. Feet shoulder width, toes slightly out.', 'Sit straight down, knees forward over the toes, torso as upright as you can keep it. Drive up through the whole foot.', 'Push the knees out and forward together. Depth comes from the hips opening, not the back rounding.'],
  lowbar: ['Bar on the rear delts, hands a little wider, elbows back. Grip hard so the bar rides on the shelf.', 'Hips back first, lean forward as much as the bar needs, then drive the hips up and forward under the bar.', 'Drive your upper back into the bar as you stand. The hips and the bar rise together, never the hips alone.'],
  frontsquat: ['Bar on the front delts, fingertips under it or arms crossed, elbows high and pointed forward. Feet shoulder width.', 'Sit straight down keeping the elbows up, knees forward. Stand by driving the elbows and chest up first.', 'If the elbows drop, the bar goes. Cue "elbows to the ceiling" for every rep.'],
  goblet: ['Hold the dumbbell or kettlebell against the chest, elbows in. Feet shoulder width, toes out.', 'Sit down between the heels with the chest tall until the elbows pass the knees. Stand tall.', 'Let the elbows gently push the knees out at the bottom. It teaches the whole squat.'],
  deadlift: ['Bar over the middle of the foot, shins an inch away. Hinge to grip just outside the legs, then pull the slack out until the bar touches the plates. Chest up, lats tight.', 'Push the floor away and drag the bar up the legs. Hips and shoulders rise together, lock out by squeezing the glutes. Lower under control.', 'Think "bend the bar around your shins." It locks the lats and keeps the bar close, which is where the strength is.'],
  sumo: ['Wide stance, toes out, shins vertical, hands inside the legs. Hips low, chest up, knees pushed out.', 'Spread the floor and drive the hips forward. The bar hugs the legs the whole way.', 'Wedge yourself under the bar before it moves. The pull starts at the hips, not the arms.'],
  trapbar: ['Stand in the middle of the bar, feet hip width. Hinge and grip the handles centered. Chest up, back flat.', 'Drive the floor away, standing tall. Lower by sending the hips back.', 'Push the knees forward slightly as you set up. It makes the lift more leg drive and easier on the back.'],
  rdl: ['Stand tall with the bar at the hips, soft knees, shoulders back. Grip just outside the legs.', 'Push the hips straight back and let the bar slide down the thighs. Stop when the hamstrings pull hard, usually just below the knee, then drive the hips forward.', 'Keep the bar touching the legs the whole way. The stretch in the hamstrings is the rep; chasing the floor is not.'],
  dbrdl: ['Dumbbells against the front of the thighs, soft knees, shoulders pulled back.', 'Hips back, dumbbells slide down the legs, back flat. Return by driving the hips forward.', 'Imagine closing a car door with your backside. The hamstrings load when the hips travel back, not down.'],
  goodmorning: ['Bar on the upper back as for a squat, feet hip width, soft knees.', 'Push the hips back with a flat spine until the torso is near parallel, then hips forward to stand.', 'Light weight, slow tempo. Feel the hamstrings hold the bar up.'],
  hipthrust: ['Shoulder blades on the bench, bar padded over the hips, feet flat and hip width so the shins are vertical at the top.', 'Drive through the heels until the hips are fully open, chin tucked, ribs down. Pause at the top, lower under control.', 'Squeeze the glutes as if pinching a coin between them at the top. The pause is where the work happens.'],
  bbglutebridge: ['Lie flat, bar padded over the hips, feet flat close to the glutes.', 'Drive the hips up until the body is a straight line from knees to shoulders. Squeeze, lower.', 'Push the knees slightly out at the top to keep the glutes, not the hamstrings, doing the job.'],
  glutebridge: ['Lie flat, feet flat and close to the glutes, arms at your sides.', 'Drive the hips up, squeeze at the top for a beat, lower slowly.', 'Exhale hard at the top and hold the squeeze for two seconds. Slower is stronger here.'],
  bench: ['Eyes under the bar, feet planted, shoulder blades pulled back and down, slight arch. Grip so the forearms are vertical at the bottom.', 'Lower to the lower chest with the elbows about 45 degrees from the body, touch, then press up and slightly back over the shoulders.', 'Try to bend the bar into a U with your hands. It sets the elbows and turns the press into a chest movement.'],
  incbench: ['Bench at 30 degrees. Shoulder blades back and down, feet planted, grip a touch narrower than flat.', 'Lower to the upper chest, elbows about 45 degrees, press straight up.', 'Drive your upper back into the bench through the whole rep. The upper chest works when the shoulders stay pinned.'],
  cgbench: ['Grip at shoulder width, not narrower. Shoulder blades back, feet planted.', 'Lower with the elbows tucked close to the body, touch low on the chest, press up.', 'Keep the wrists stacked over the elbows. The triceps take over when the elbows stay tucked.'],
  dbbench: ['Kick the dumbbells up with the knees, lie back with the shoulder blades pinned, feet planted.', 'Lower with the elbows about 45 degrees until the dumbbells are level with the chest, press up and slightly together.', 'Squeeze the dumbbells toward each other at the top without letting them touch. That is the chest finishing the rep.'],
  incdb: ['Bench at 30 degrees, dumbbells kicked up, shoulder blades back and down.', 'Lower until the dumbbells are level with the upper chest, elbows about 45 degrees, press up and in.', 'Keep the chest lifted toward the ceiling the whole set. If the shoulders roll forward the delts take the work.'],
  dbfly: ['Light dumbbells, palms facing, slight bend in the elbows that never changes.', 'Open the arms in a wide arc until you feel a stretch across the chest, then hug back up.', 'Lead with the elbows, not the hands, and squeeze the biceps toward each other at the top.'],
  cablefly: ['Handles at chest height, one foot forward, slight lean, soft elbows.', 'Bring the hands together in an arc in front of the chest, pause, open back up under control.', 'Cross the hands over at the end for an extra squeeze. Slow on the way back.'],
  pecdeck: ['Seat height so the handles are level with the chest. Shoulders back into the pad.', 'Bring the pads together with a slow squeeze, open until you feel the chest stretch.', 'Pause a full second at the squeeze. The machine cannot cheat the top for you.'],
  chestpress: ['Seat so the handles line up with the lower chest. Shoulder blades back into the pad, feet flat.', 'Press out until the arms are nearly straight, return until the handles are level with the chest.', 'Push the shoulder blades into the pad as you press. It keeps the chest doing the work.'],
  ohp: ['Bar at the collarbones, hands just outside the shoulders, elbows slightly in front of the bar. Glutes and abs tight.', 'Press straight up, pulling the head back out of the way, then push the head through once the bar passes it. Lock out over the mid foot.', 'Squeeze the glutes as if standing at attention. A tight body under the bar is a stronger press.'],
  seatedohp: ['Back against the pad, bar or dumbbells at the collarbones, feet planted.', 'Press straight up to lockout, lower to the collarbones.', 'Keep the ribs down. Arching to press is the lower back cheating for the shoulders.'],
  pushpress: ['Bar racked on the front delts, feet hip width, torso tall.', 'Dip a few inches at the knees, drive up with the legs and press the bar the rest of the way. Lower with control.', 'The dip is fast and shallow. Think "dip, drive, press" as three quick beats.'],
  dbohp: ['Dumbbells at shoulder height, palms forward or slightly in, core tight.', 'Press up and slightly in until the arms are straight, lower to the shoulders.', 'Stop the dumbbells an inch short of touching at the top and squeeze the delts.'],
  arnold: ['Dumbbells at the shoulders, palms facing you, elbows in front.', 'Rotate the palms outward as you press up, reverse on the way down.', 'Rotate slowly. The turn is where the front delt works hardest.'],
  latraise: ['Light dumbbells, slight forward lean, soft elbows, hands turned so the thumbs are level with or just below the pinkies.', 'Raise out to the side until the arms are level with the shoulders, lead with the elbows, lower slowly.', 'Imagine pouring water out of a jug at the top. Lift with the elbows and keep the traps out of it.'],
  cablelat: ['Cable low, stand side on, handle in the far hand across the body.', 'Raise out to the side to shoulder height, lower slowly.', 'The cable loads the bottom of the rep. Make the first six inches slow.'],
  frontraise: ['Dumbbells or a plate in front of the thighs, soft elbows.', 'Raise to shoulder height, pause, lower slowly.', 'Keep the shoulders down; if the traps shrug, the weight is too heavy.'],
  reardelt: ['Hinge at the hips with a flat back, dumbbells hanging, palms facing.', 'Raise out to the sides with soft elbows until the arms are level with the back, squeeze, lower.', 'Lead with the pinkies. Think of pulling the room apart with the elbows.'],
  facepull: ['Rope at face height, step back, elbows high.', 'Pull toward the face with the elbows flaring out and the hands ending beside the ears. Squeeze, return slowly.', 'Finish with the knuckles pointing at the ceiling. That external rotation is the whole point.'],
  row: ['Hinge to about 45 degrees, bar hanging under the shoulders, flat back, knees soft.', 'Pull the bar to the lower ribs with the elbows driving back, squeeze the shoulder blades, lower under control.', 'Pull with the elbows, not the hands. Picture the hands as hooks and the elbows doing the work.'],
  pendlay: ['Bar on the floor each rep, torso parallel, flat back.', 'Explode the bar to the lower chest, return to a dead stop on the floor.', 'Reset the back flat on every rep. The pause on the floor is the exercise.'],
  dbrow: ['One hand and knee on the bench, back flat, dumbbell hanging straight down.', 'Row the dumbbell to the hip, elbow close to the body, squeeze, lower fully.', 'Let the shoulder blade drop at the bottom and pull it back first. Then the arm follows.'],
  tbar: ['Chest on the pad or hinged over the bar, handles in a neutral grip.', 'Row to the chest, squeeze the shoulder blades together, lower to a full stretch.', 'Drive the elbows back and down. The lats take over when the elbows stay close.'],
  cablerow: ['Sit tall, feet braced, slight bend at the knees, chest up.', 'Pull the handle to the stomach with the elbows driving back, squeeze, let the arms extend fully.', 'Let the shoulders roll forward a little at the stretch, then pull them back before the arms bend.'],
  machrow: ['Chest against the pad, handles gripped, feet planted.', 'Row to the sides of the chest, squeeze, return under control.', 'Pause at the squeeze. On a machine the back half of the rep is the whole game.'],
  pulldown: ['Grip a little wider than the shoulders, thighs under the pads, chest tall.', 'Pull the bar to the upper chest with the elbows driving down and back, squeeze, return to a full stretch.', 'Think of pulling the elbows into the back pockets. The lats work when the elbows lead.'],
  pullup: ['Hands just outside the shoulders, full hang, shoulders active, not slack.', 'Pull the chest to the bar leading with the elbows, lower all the way.', 'Imagine pulling the bar down to you rather than pulling yourself up. It keeps the lats engaged.'],
  chinup: ['Palms facing you, hands shoulder width, full hang.', 'Pull until the chin clears the bar, squeeze, lower fully.', 'Keep the elbows in front of you at the top and squeeze the biceps as you finish.'],
  dip: ['Arms locked at the top, slight forward lean for chest, upright for triceps, shoulders down.', 'Lower until the upper arms are parallel to the floor, press back up.', 'Push the shoulders down and away from the ears at the top. That is the lockout that protects the joint.'],
  pushup: ['Hands under the shoulders, body in one straight line, glutes tight.', 'Lower the chest to the floor with the elbows about 45 degrees, press back up.', 'Screw the hands into the floor as if tightening two jars. It sets the shoulders and turns on the chest.'],
  curl: ['Stand tall, bar at the thighs, elbows pinned to the sides.', 'Curl to the shoulders without the elbows moving forward, squeeze, lower slowly.', 'Turn the pinkies up at the top. The biceps rotate as well as bend.'],
  ezcurl: ['EZ bar with the hands on the angled grips, elbows at the sides.', 'Curl up, squeeze, lower slowly with the elbows still.', 'Lower for three seconds. The way down builds the arm.'],
  dbcurl: ['Dumbbells at the sides, palms forward or turning as you curl.', 'Curl one or both up without swinging, squeeze, lower slowly.', 'Supinate hard at the top so the pinky is higher than the thumb.'],
  hammer: ['Dumbbells at the sides, palms facing in.', 'Curl straight up with the palms still facing each other, lower slowly.', 'Squeeze the dumbbell handle as hard as you can. The forearm and brachialis switch on.'],
  preacher: ['Armpits at the top of the pad, upper arms flat on it.', 'Curl up, stop just short of vertical, lower until the arms are almost straight.', 'Do not rest at the top. The tension lives in the bottom half.'],
  pushdown: ['Elbows pinned at the sides, slight lean, handle at chest height.', 'Press down until the arms are straight, squeeze the triceps, return until the forearms pass parallel.', 'Keep the upper arms still. If the elbows drift forward, the lats are cheating.'],
  ropepushdown: ['Rope at chest height, elbows tucked.', 'Press down and pull the rope ends apart at the bottom, return slowly.', 'Spread the rope at the bottom and turn the palms down. That is the lateral head lighting up.'],
  ohtri: ['Dumbbell held overhead in both hands, elbows pointing forward and close.', 'Lower behind the head until the forearms touch the biceps, press back up.', 'Keep the elbows narrow the whole way. Wide elbows move the load to the shoulders.'],
  skull: ['Lie on the bench, bar over the forehead, upper arms angled slightly back.', 'Lower to just above the forehead by bending only the elbows, press back up.', 'Lower for three seconds and stop an inch above the head. Never let the elbows flare.'],
  shrug: ['Bar or dumbbells at the sides, shoulders back.', 'Lift the shoulders straight up toward the ears, hold, lower fully.', 'Straight up and down, no rolling. Pause at the top for a full second.'],
  legpress: ['Feet shoulder width in the middle of the plate, back flat on the pad.', 'Lower until the knees are near 90 degrees or the hips start to lift, press without locking out hard.', 'Push through the whole foot. Keep the lower back on the pad; if it lifts, you went too deep.'],
  hacksquat: ['Shoulders under the pads, feet a little forward on the plate, hip width.', 'Lower under control as deep as the back stays flat, drive up.', 'Feet higher on the plate for glutes and hamstrings, lower for quads. Pick one and be consistent.'],
  legext: ['Pad on the shins just above the feet, knees lined up with the pivot.', 'Extend until the legs are straight, squeeze the quads for a beat, lower slowly.', 'Pause at the top and lower for three seconds. Point the toes up.'],
  legcurl: ['Pad just above the heels, hips pressed into the bench.', 'Curl the heels to the glutes, pause, lower slowly.', 'Keep the hips down. If they rise, the lower back is helping.'],
  seatedcurl: ['Pad on the calves, thighs strapped, sit back into the seat.', 'Curl the heels under the seat, pause, return slowly.', 'Lean forward slightly to lengthen the hamstrings. Feel the stretch at the top.'],
  calf: ['Balls of the feet on the edge, heels hanging, legs straight.', 'Rise as high as possible, pause, lower until the calves are fully stretched.', 'Pause two seconds at the bottom stretch. Bouncing uses the tendon, not the muscle.'],
  seatedcalf: ['Pads on the lower thighs, balls of the feet on the edge.', 'Rise high, squeeze, lower slowly to a full stretch.', 'Slow reps. The seated version hits the soleus, which likes time under tension.'],
  lunge: ['Stand tall with dumbbells at the sides, feet hip width.', 'Step forward into a long stride, lower until both knees are near 90 degrees, push through the front foot into the next step.', 'Keep the torso tall and the front knee over the mid foot. Drive through the heel of the front leg.'],
  revlunge: ['Stand tall, dumbbells at the sides.', 'Step back into a long stride, lower until the back knee nearly touches, push through the front heel to stand.', 'Easier on the knees than forward lunges; sit into the front hip.'],
  bss: ['Back foot on a bench, front foot far enough forward that the shin stays near vertical.', 'Lower straight down until the back knee nearly touches, drive up through the front foot.', 'Lean the torso slightly forward for glutes, stay upright for quads.'],
  splitsquat: ['Split stance, front foot flat, back heel up.', 'Lower straight down, back knee toward the floor, drive up.', 'Think "down, not forward." The front knee tracks over the toes.'],
  stepup: ['Box at knee height, whole foot on the box.', 'Drive through the box foot to stand tall on it, control the way down.', 'Do not push off the bottom foot. The leg on the box does all the work.'],
  kbswing: ['Kettlebell a foot in front, hinge to grip it, hike it back between the legs.', 'Snap the hips forward to float the bell to chest height, let it fall and hinge again.', 'The arms are ropes; the hips are the engine. Stand tall at the top and squeeze the glutes.'],
  plank: ['Forearms down, elbows under the shoulders, body in one line from head to heels.', 'Hold with the glutes and abs tight. Breathe.', 'Pull the elbows toward the toes without moving. The whole trunk locks.'],
  legraise: ['Hang from the bar, shoulders active, legs straight or slightly bent.', 'Raise the legs by curling the pelvis up, lower slowly without swinging.', 'Tilt the pelvis before the legs move. That curl is the abs; the rest is hip flexors.'],
  cablecrunch: ['Kneel facing the stack, rope beside the head, hips still.', 'Crunch the elbows toward the thighs by rounding the spine, return slowly.', 'Keep the hips fixed and round the back like a cat. Pulling with the arms wastes the rep.'],
  crunch: ['Lie back, knees bent, hands light behind the head.', 'Curl the shoulders off the floor, pause, lower slowly.', 'Exhale fully at the top and pull the ribs toward the hips.'],
  run: ['Start easy for the first few minutes, tall posture, relaxed shoulders and hands.', 'Quick light steps landing under the body, about 170 to 180 per minute. Breathe in a rhythm.', 'Run easy days easy enough to talk. Hard days can be hard because the easy days were.'],
  treadmill: ['Set a 1% incline to match outdoor effort. Start walking, then build over a minute.', 'Land under the body, not out in front. Keep the eyes forward, not on the console.', 'Hands off the rails. Holding on cuts the work by a third.'],
  inclinewalk: ['Start flat for two minutes, then set the incline. Hands off the rails, posture tall.', 'Shorten the stride slightly and push through the whole foot. Swing the arms.', 'Lean from the ankles, not the waist. The glutes and calves do the climbing.'],
  walk: ['Tall posture, relaxed arms, comfortable pace.', 'Pick a pace that lifts the breathing without stopping conversation.', 'Add hills or a pack when it stops feeling like work.'],
  ruck: ['Pack high and tight on the back, straps snug, weight close to the spine.', 'Walk tall with a slightly shorter stride. Lean into hills from the ankles.', 'Start light, add five pounds when the last mile feels easy. The pack is the progression.'],
  tmruck: ['Pack snug and high, incline set before you step on, hands off the rails.', 'Walk with a shorter stride and a slight forward lean from the ankles.', 'Bump incline before pace. Rucking is about carrying, not speed.'],
  bike: ['Saddle height so the knee has a slight bend at the bottom. Light grip.', 'Spin at 80 to 100 rpm, pushing and pulling through the whole circle.', 'Relax the shoulders and let the legs do all the work. Cadence first, resistance second.'],
  rower: ['Straps over the balls of the feet, arms straight, shins vertical at the catch.', 'Push with the legs, then swing the back, then pull the arms. Return arms, body, legs.', 'Legs, body, arms. Then arms, body, legs. Most of the power is the leg drive.'],
  elliptical: ['Whole foot on the pedal, tall posture, light grip on the handles.', 'Smooth strides, drive the heels down, use the handles for the upper body.', 'Let go of the handles for a minute now and then; the core has to work.'],
  stairs: ['Tall posture, hands light or off the rails.', 'Whole foot on each step, push through the heel, steady rhythm.', 'Hands off the rails; leaning on them halves the work.'],
  swim: ['Warm up with easy lengths, focus on a long stroke.', 'Reach, catch the water with the forearm, pull past the hip. Breathe every two or three strokes.', 'Fewer strokes per length is a better swim, not a slower one.'],
  jumprope: ['Rope handles at hip height, elbows in, small wrist circles.', 'Small hops on the balls of the feet, just high enough to clear the rope.', 'Quiet feet. If you can hear the landing, you are jumping too high.'],
  sprints: ['Warm up fully: jog, drills, a few build-ups.', 'Drive hard for the distance, walk back, repeat. Stop the session when speed drops.', 'Sprints are quality work. Rest more than feels necessary between them.'],
  hike: ['Pack fitted, poles if the terrain is steep, start easy.', 'Short steps uphill, whole foot down, control the descents.', 'Pace to the climb, not the map. The summit is halfway.'],
  burpee: ['Feet hip width, start standing.', 'Hands down, feet back to a plank, chest to floor, feet in, jump.', 'Keep a rhythm rather than a sprint. Land softly.'],
  boxjump: ['Box at a height you can land softly on, feet hip width.', 'Swing the arms, jump, land in a quarter squat on the box. Step down, never jump down.', 'Land like a cat. Quiet landings mean the legs absorbed the work.'],
  // library expansion 2
  hsreardelt: ["Sit facing the pad with the chest against it, seat set so the handles are at shoulder height. Grab the handles with a neutral or palms-down grip, arms almost straight.", "Sweep the arms back and out in a wide arc until the hands are in line with the shoulders, then return slowly without letting the plates touch.", "Lead with the pinkies and keep a soft bend in the elbows. If the elbows bend more on the way back, the triceps and lats are stealing the rep."],
  revhack: ["Face the pad, chest and hips against it, feet on the platform at hip width. Shoulders under the pads, release the safeties.", "Sit back and down, letting the hips travel back along the pad, until the thighs are at least parallel. Drive through the heels to stand.", "Push the hips into the pad as you rise. This one is a glute and hamstring squat, so feel the back of the legs do the work."],
  smithhip: ["Upper back on a bench, bar across the hips on a pad, feet flat and shins vertical at the top. Unhook the bar with the hips low.", "Drive the hips up until the torso is flat, chin tucked, ribs down. Squeeze the glutes hard at the top, then lower under control.", "The bar path is fixed, so set the bench so the bar sits over the hip crease at lockout. Tuck the chin and look forward, never up."],
  lmrdl: ["Stand facing the loaded end with the bar between the feet, hands stacked on the sleeve, soft knees, shoulders back.", "Push the hips back and let the bar slide down the thighs until the hamstrings pull tight, then drive the hips forward to stand.", "Keep the bar dragging along the legs. The arc of the landmine wants to pull it away, so fight that with the lats."],
  lmchestpress: ["Stand tall with the bar end held at the shoulder in one hand, feet staggered, the opposite foot forward. Brace the core.", "Press up and forward along the arc of the bar until the arm is straight, then lower to the shoulder under control.", "Squeeze the chest as the arm crosses the midline at the top. Think of pushing the bar away from the body, not up."],
  halfkneellm: ["Kneel on the same-side knee as the pressing arm, other foot planted in front. Hold the bar end at the shoulder, glute of the down leg squeezed.", "Press up and away along the arc until the elbow locks, then bring it back to the shoulder without letting the ribs flare.", "The press starts from a tall, still torso. If the hip drifts, tighten the glute of the kneeling leg before the next rep."],
  lmpushpress: ["Stand with the bar end at the shoulder in one or both hands, feet under the hips, torso tall.", "Dip a few inches at the knees, drive up with the legs and finish the press with the arms. Lower to the shoulder and reset before the next rep.", "The dip is short and fast. A deep dip turns it into a thruster and wastes the leg drive."],
  cablecrossover: ["Set the pulleys high, grab a handle in each hand and step forward into a staggered stance with a slight lean. Elbows soft.", "Bring the hands down and together in an arc in front of the hips, squeeze, then let the arms open back up until the chest stretches.", "Cross the hands over each other on alternate reps. The last few inches of the squeeze are where the chest lights up."],
  hspulldown: ["Set the seat so the handles start just above your reach with the arms straight, thighs locked under the pads. Grab with a neutral or wide grip.", "Pull the handles down and slightly back until they reach the upper chest, elbows driving toward the back pockets. Return to a full stretch.", "Let the shoulders rise at the top so the lats stretch, then start every rep by pulling the shoulder blades down first."],
  hslowrow: ["Sit tall with the chest on the pad and the feet on the platform. Reach out to grab the low handles, shoulders forward for a stretch.", "Row the handles back and down toward the hips, elbows tight to the sides, squeeze the shoulder blades, then let the arms go all the way forward.", "Keep the chest glued to the pad. If it lifts, the lower back is rowing and the lats are not."],
  cstbar: ["Lie chest down on the pad, feet on the platform, grab the handles with the arms hanging straight.", "Drive the elbows up and back until the handles almost touch the pad, pause, then lower to a full stretch.", "Because the chest is supported you cannot cheat with the body. Use a lighter weight than a free T-bar and own the squeeze."],
  helms: ["Rest the forehead and upper chest on the end of an incline bench set to about 30 degrees, a dumbbell in each hand hanging straight down.", "Row the elbows up and back, squeeze the shoulder blades together, lower under control until the arms are straight.", "The bench takes the body english away. Row with the elbows, not the hands, and feel the mid back close."],
  kneelinglegcurl: ["Kneel on the pad with one knee, the other ankle under the roller, hips flat against the pad and hands on the handles.", "Curl the heel up toward the glute as far as it goes, squeeze, then lower slowly until the leg is straight.", "Keep the hips pressed down the whole rep. If they lift, the hamstring is shortening less than you think."],
  nordicmachine: ["Kneel with the ankles locked under the pads and the knees on the cushion, hips fully extended, hands ready to catch.", "Lower the body forward as slowly as you can while keeping the hips straight, catch with the hands, push back up lightly and pull with the hamstrings.", "Fight for every inch on the way down. Even an assisted rise counts if the lowering was slow."],
  hackcalf: ["Stand on the platform with the balls of the feet on the edge, shoulders under the pads, knees straight but not locked.", "Lower the heels until the calves stretch fully, pause for a second, then rise onto the toes and hold the top.", "Pause at the bottom every rep. Bouncing out of the stretch uses the tendon, not the muscle."],
  smithfront: ["Bar on the front delts with the elbows high, feet slightly ahead of the bar so the fixed path lets you sit straight down.", "Sit down between the heels, chest tall and elbows up, then drive the elbows up as you stand.", "The rail does the balancing, so use it to sit deeper than a free front squat allows."],
  lmthruster: ["Hold the bar end at the chest with both hands, feet shoulder width, bar path angled away from the body.", "Squat to parallel, then drive up and press the bar out along the arc in one motion. Bring it back to the chest as you drop into the next rep.", "Time the press so the arms take over just as the legs finish. One smooth rep, not a squat then a press."],
  lmhack: ["Stand with the back to the loaded end, bar end held behind you at the hips or on the shoulder, feet forward of the bar.", "Sit down and back with the torso upright until the thighs are parallel, then drive up through the whole foot.", "Stay tall. The lean of the bar lets the quads take almost everything if the chest stays up."],
  lmrevlunge: ["Hold the bar end at the chest with both hands or in one hand at the shoulder. Stand tall with the feet together.", "Step back into a lunge until the rear knee hovers over the floor, then drive through the front foot to return.", "Keep the front shin close to vertical. Push the floor away with the front heel and let the back leg just balance."],
  cossack: ["Stand wide, toes pointing forward or slightly out, dumbbell held at the chest.", "Shift all the weight onto one leg and sit down over that heel while the other leg straightens, toes up. Push back to the middle and switch.", "Go only as deep as the heel stays down. The range grows week to week if you never force it."],
  dbfrontsquat: ["Rack a dumbbell on each shoulder, elbows forward, feet shoulder width, toes out a touch.", "Sit straight down keeping the chest tall and the dumbbells resting on the shoulders. Drive up through the whole foot.", "Think \"elbows up\" the whole rep. Once they drop, the weight pulls you forward."],
  sissymachine: ["Lock the ankles under the pads with the shins against the front pad, standing tall with the hips open.", "Bend at the knees and lean back in one line from knee to shoulder, going as low as control allows, then pull back up with the quads.", "The hips never bend. Squeeze the glutes to keep the body a straight line and feel the quads take the whole load."],
  kbsldl: ["Hold the bell in the hand opposite the standing leg, soft knee, hips square.", "Hinge forward while the free leg reaches back, keeping the hips level, until the hamstring pulls tight. Drive the hip forward to stand.", "Picture the back foot pushing a wall behind you. It keeps the hips square and the balance easy."],
  wallwalk: ["Lie face down with the feet against the wall, hands under the shoulders.", "Push up and walk the feet up the wall while the hands walk toward it, until the chest is near the wall, then walk back down under control.", "Keep the ribs tucked and the glutes tight. A tight body walks up; a soft one sags in the middle."],
  wallhandstand: ["Hands a few inches from the wall, fingers spread and gripping the floor. Kick or walk up so the heels rest on the wall.", "Push the floor away, stack the shoulders over the wrists and hold with the ribs down and legs squeezed together.", "Push tall through the shoulders as if trying to get taller. The hold gets easier when the body is one stacked line."],
  ghdsitup: ["Set the pad so the hips hang just off the front edge, feet locked in, knees slightly bent.", "Lower back until the hands touch the floor behind you, then swing up by extending the knees slightly and crunching hard to sit up.", "Keep the reps smooth and the range honest. Start with short sets; the soreness from this one comes late."],
  standingcablecrunch: ["Face away from a high pulley with the rope held at the forehead, feet hip width, knees soft.", "Crunch down by pulling the ribs toward the hips, rounding the upper back, then return tall under control.", "The hips stay still. If they push back, the hip flexors are pulling instead of the abs."],
  lmrainbow: ["Stand facing the landmine with the bar end held at arm's length in front of the chest, feet wide, knees soft.", "Sweep the bar in a wide arc from one hip to the other, keeping the arms straight and the hips facing forward.", "Let the obliques stop the bar at each end. Smaller and slower beats big and fast."],
  lmantirot: ["Kneel or stand side-on to the landmine with the bar end held at the chest in both hands.", "Press the bar straight out in front of the chest and hold, then bring it back. The bar tries to pull you toward the pivot; do not let it.", "Squeeze the glutes and breathe out as you press. The hold is the rep."],
  bbrollout: ["Kneel behind a barbell loaded with round plates, hands on the bar at shoulder width, hips forward.", "Roll the bar out in front, letting the body lengthen while the hips stay in line, then pull it back with the abs and lats.", "Tuck the tailbone before the rollout. An arched lower back is the sign to shorten the range."],
  cleanpress: ["Bar over the mid foot, hands just outside the legs. Pull the slack out with a flat back.", "Pull the bar to the shoulders in one clean, stand tall, then strict press it overhead. Lower to the shoulders, then to the floor.", "Reset the brace between the clean and the press. Two strong halves beat one rushed rep."],
  squatclean: ["Bar over the mid foot, hook grip just outside the legs, hips down, chest up.", "Pull from the floor, extend the hips hard, then pull under the bar into a full front squat and stand up.", "Meet the bar with the elbows already high. The catch is a front squat, so own that first."],
  hangpowerclean: ["Hold the bar at the hips with a hook grip, shoulders over the bar, knees soft.", "Push the hips back to mid thigh, then extend hard and shrug, pulling the elbows through to catch the bar on the shoulders in a quarter squat.", "Jump and land in the same spot. A big hip drive makes the bar float; the arms only guide it."],
  sdhp: ["Wide stance, toes out, hands close together on the bar inside the knees. Hips low, chest up.", "Stand and extend the hips, then pull the elbows high to bring the bar to the collarbone. Lower in the same path.", "Hips first, arms last. If the elbows bend before the hips finish, slow down and lighten it."],
  kbgoblet: ["Hold the bell by the horns against the chest, elbows in. Feet shoulder width, toes out.", "Sit down between the heels with the chest tall until the elbows pass the knees. Stand tall.", "Let the elbows gently push the knees out at the bottom. It teaches the whole squat."],
  gorillarow: ["Two bells between the feet, hinge with a flat back until the hands reach the handles, knees soft.", "Row one bell to the hip while pushing the other into the floor, lower, then switch. Keep the hips square.", "Push the resting bell into the floor. It keeps the torso still so the rowing side has to work."],
  lmsarow: ["Stand beside the loaded end in a hinge, one hand on the bar sleeve, the other braced on the thigh.", "Row the bar to the hip, elbow tight, squeeze the lat, then lower to a full stretch.", "Let the shoulder reach at the bottom, then start the rep by pulling the shoulder blade back before the elbow bends."],
  renegaderow: ["High plank on two dumbbells, feet wide, shoulders over the hands.", "Row one dumbbell to the hip without letting the hips twist, set it down quietly, then the other side.", "Widen the feet if the hips rotate. The row only counts if the plank stays still."],
  andersonsquat: ["Set the safeties at the bottom position, load the bar on them and get under it with the full squat set-up.", "Brace, then drive the bar up off the pins to stand. Lower under control until the bar rests fully on the pins, and relax before the next rep.", "Every rep starts dead. Rebuild the brace on the pins each time; that is the whole point."],
  bbhacksquat: ["Stand with the bar behind the calves, hinge to grip it just outside the legs, chest up.", "Stand up by driving the knees forward and the hips through, dragging the bar up behind the legs. Lower the same way.", "Keep the heels down and the torso tall. It is a quad squat with a bar behind you, not a deadlift."],
  jeffersonsquat: ["Straddle the bar with one foot ahead of it and one behind, mixed grip front and back, torso tall.", "Squat straight down between the legs and stand, keeping the bar between the feet. Switch the lead foot each set.", "Push the knees out and keep the chest square to the side. The twist you feel is the exercise doing its job."],
  hillsprints: ["Find a hill you can sprint up in 8 to 15 seconds. Warm up with easy jogging and a few strides first.", "Sprint up with a short quick stride, walk back down, repeat. Start with 6 and add one a week.", "Full recovery between reps is the plan, not the failure. Sprint fast, walk slow."],
  tempo: ["Ten minutes easy first, then settle in.", "Run 20 to 40 minutes at a pace you could hold for about an hour: hard but controlled, a few words at a time. Finish with an easy jog.", "Comfortably hard. If you cannot say a short sentence, back off a touch."],
  longrun: ["Easy pace from the first step, fuel and water sorted for anything over 90 minutes.", "Run at a pace where you can talk in full sentences the whole way. Add 10 percent to the distance each week, then hold or ease back every fourth.", "The long run builds the engine at an easy pace. Slower than you think is right."],
  recoveryrun: ["Day after a hard session. Keep it short and flat.", "Jog at a pace that feels almost too easy for 20 to 40 minutes. Heart rate low, breathing through the nose if you can.", "You should finish feeling better than when you started. If it felt like a workout, it was too fast."],
  fartlek: ["Warm up 10 minutes easy.", "Mix fast surges of 30 seconds to 3 minutes with easy running until the time is up. Pick landmarks, no watch needed.", "Play with the pace. The point is variety without a plan."],
  trackintervals: ["Warm up 10 to 15 minutes with strides.", "Run repeats at a hard, even pace with a jog or walk between. 400s with equal rest, or 800s with 2 to 3 minutes. Cool down easy.", "Even splits. The last rep should be as fast as the first, not faster."],
  curvedtm: ["Step on with the belt still and start walking. Handrails only to steady yourself.", "Lean slightly forward and push the belt behind you. Speed comes from where your feet land, not from a button.", "Land the feet a little farther forward to speed up and let them drift back to slow down. Short quick steps beat long strides."],
  treadmillhike: ["Incline up to 10 to 15 percent, speed at a pace you can hold without the handrails.", "Walk tall for 30 to 45 minutes, arms swinging. Hands on the rails cut the work in half, so keep them off.", "Drive through the whole foot and push the hip forward. It should feel like a hill, not a lean."],
  doubleunders: ["Rope handles at hip height, elbows in, jump with the feet together.", "Jump a little higher and spin the wrists twice per jump. Build with single-single-double before stringing doubles.", "The jump barely changes; the wrists get faster. Stay tall and relaxed in the shoulders."],
  metcon: ["Read the workout, pick weights you can move with good form when tired, warm up the movements.", "Move steadily, breaking sets before you have to. Record the score or the time.", "Pace the first third slower than feels right. The workout starts when it gets hard."],
  jacobsladder: ["Clip the belt in, step on the rungs and start climbing at a comfortable rhythm.", "Climb with the hands and feet in an alternating rhythm for the planned time. The ladder speeds up as you climb faster.", "Stay low and let the legs drive. A tall torso on this machine burns the arms out first."]
};
/* Variations borrow the cues of the lift they come from. */
const TIPS_ALIAS = {bbsplitsquat: 'splitsquat', bbbss: 'bss', kbbss: 'bss', bwbss: 'bss', smithsplit: 'bss', lmsplit: 'bss', bbstepup: 'stepup', kbstepup: 'stepup', bwstepup: 'stepup', smithstepup: 'stepup', bbrevlunge: 'revlunge', frontracklunge: 'revlunge', bbwalklunge: 'lunge', bwlunge: 'lunge', ohwalklunge: 'lunge', dblkbfront: 'dbfrontsquat', cluster: 'lmthruster', snatchrdl: 'rdl', sumordl: 'rdl', dbsldl: 'dbrdl', bstancehip: 'hipthrust', kbhipthrust: 'hipthrust', bwhipthrust: 'hipthrust', dbglutebridge: 'glutebridge', feetelevbridge: 'glutebridge', bandglutebridge: 'glutebridge', bandedhipthrust: 'hipthrust', jeffersondl: 'deadlift', dbdeadlift: 'deadlift', kbsumo: 'sumo', suitcasedl: 'deadlift', lmsldl: 'kbsldl', lmgoodmorning: 'goodmorning', smithgm: 'goodmorning', ssbgm: 'goodmorning', larsen: 'bench', pinpress: 'bench', slingshot: 'bench', tempobench: 'bench', ngdbbench: 'dbbench', revgripdb: 'dbbench', altdbbench: 'dbbench', deficitdbpress: 'dbbench', kbfloorpress: 'dbbench', smithcg: 'cgbench', smithfloor: 'bench', lmsqueeze: 'lmchestpress', inccable: 'cablefly', deccable: 'cablefly', seatedcablefly: 'cablefly', bandfly: 'dbfly', standingdbfly: 'dbfly', plateloadedfly: 'pecdeck', hsdec: 'chestpress', hswide: 'chestpress', convergingpress: 'chestpress', bandchestpress: 'chestpress', sacablepress: 'lmchestpress', ngdbohp: 'dbohp', altdbohp: 'dbohp', seesaw: 'dbohp', dblkbpress: 'dbohp', bottomsup: 'dbohp', platepress: 'dbohp', axlepress: 'ohp', circusdb: 'dbohp', dbcleanpress: 'cleanpress', hsohp: 'ohp', smithbtn: 'ohp', bandohp: 'dbohp', lmlateral: 'latraise', lyinglateral: 'latraise', luraise: 'latraise', bandlateral: 'latraise', behindbacklateral: 'cablelat', lmfront: 'frontraise', bandfrontraise: 'frontraise', machfrontraise: 'frontraise', powell: 'reardelt', csreardelt: 'reardelt', dbreardeltrow: 'reardelt', lmreardelt: 'hsreardelt', cablereardeltrow: 'facepull', kneelfacepull: 'facepull', bandfacepull: 'facepull', cableyraise: 'facepull', btbshrug: 'shrug', ohshrug: 'shrug', kelso: 'shrug', dbfarmershrug: 'shrug', machshrug: 'shrug', bentdbrow: 'dbrow', kbrow: 'dbrow', deadstoprow: 'dbrow', trapbarrow: 'row', wgsealrow: 'row', lmtbar: 'tbar', machlowrow: 'hslowrow', standingcablerow: 'cablerow', highrowcable: 'facepull', bandrow: 'cablerow', shotgunrow: 'cablerow', revgrippulldown: 'pulldown', btnpulldown: 'pulldown', ropepulldown: 'pulldown', kneelpulldown: 'pulldown', hsfrontpulldown: 'hspulldown', bandpulldown: 'pulldown', negpullup: 'pullup', jumppullup: 'pullup', kippullup: 'pullup', butterflypullup: 'pullup', c2bpullup: 'pullup', archerpullup: 'pullup', lsitpullup: 'pullup', commandopullup: 'pullup', ringpullup: 'pullup', towelpullup: 'pullup', typewriter: 'pullup', trxpullup: 'pullup', assistngpullup: 'pullup', chinupbiceps: 'chinup', rackchin: 'chinup', widepushup: 'pushup', clappushup: 'pushup', spiderpushup: 'pushup', pseudoplanche: 'pushup', kneepushup: 'pushup', paralettepushup: 'pushup', handreleasepushup: 'pushup', chestdip: 'dip', sacablecurl: 'dbcurl', lyingcablecurl: 'curl', cablepreacher: 'preacher', cablehammersa: 'hammer', seateddbcurl: 'dbcurl', waiter: 'dbcurl', revdbcurl: 'dbcurl', dbdragcurl: 'dbcurl', preacherhammer: 'hammer', inchammer: 'hammer', curl21: 'curl', strictcurl: 'curl', cgezcurl: 'ezcurl', ezpreacherrev: 'preacher', spiderez: 'ezcurl', machhammer: 'hammer', kbcurl: 'dbcurl', bandhammer: 'hammer', trxcurl: 'dbcurl', ropeoh: 'ohtri', cablelyingext: 'skull', crossbodyext: 'pushdown', cablekickbackrope: 'pushdown', bbskull: 'skull', incskull: 'skull', decskull: 'skull', bbohext: 'ohtri', seatedohtri: 'ohtri', bwskull: 'skull', bandohtri: 'ohtri', bandtrikick: 'pushdown', trxtri: 'skull', seateddipmach: 'dip', dbfloorskull: 'skull', smithsumo: 'squat', legpresswide: 'legpress', legpressnarrow: 'legpress', legpresshigh: 'legpress', hslegpress: 'legpress', lyinglegpress: 'legpress', slegpresscalf: 'calf', bbcalf: 'calf', kbcalf: 'calf', lmcalf: 'calf', bwcalf: 'calf', dbslcalf: 'calf', ballcurl: 'legcurl', slidercurl: 'legcurl', bandlegcurl: 'legcurl', lmlatlunge: 'cossack', dbsidelunge: 'cossack', bwcossack: 'cossack', lmsumo: 'kbgoblet', hindusquat: 'squat', bandsquat: 'squat', stepdown: 'stepup', sledlunge: 'lunge', dbjumpsquat: 'boxjump', tuckjump: 'boxjump', depthjump: 'boxjump', splitjump: 'boxjump', lateralbound: 'boxjump', wtdboxjump: 'boxjump', cablesidebend: 'cablecrunch', lowtohighchop: 'lmrainbow', kneelingpallof: 'lmantirot', standingabwheel: 'bbrollout', plankshouldertap: 'plank', sideplankdip: 'plank', plankreach: 'plank', trxfallout: 'bbrollout', trxpike: 'plank', trxkneetuck: 'plank', sliderkneetuck: 'plank', scissorkick: 'legraise', windshield: 'legraise', lyingwindshield: 'legraise', hangslraise: 'legraise', hangobliqueraise: 'legraise', heeltouch: 'crunch', decoblique: 'crunch', medballvup: 'crunch', wallballsitup: 'crunch', muscleclean: 'hangpowerclean', musclesnatch: 'hangpowerclean', snatchpull: 'squatclean', snatchbalance: 'squatclean', groundtooverhead: 'cleanpress', dbhangclean: 'hangpowerclean', dbswing: 'kbswing', kbhighpull: 'kbswing', kbfigure8: 'kbswing', kbdeadclean: 'kbswing', kbjerk: 'lmpushpress', kblongcycle: 'lmpushpress', kbcleansquatpress: 'lmthruster', rowerburpee: 'burpee', barfacingburpee: 'burpee', burpeepullup: 'burpee', bwsquatthrust: 'burpee', boxstepover: 'stepup', dbboxstepover: 'stepup', walkingpad: 'walk', tmsprints: 'sprints', powerwalk: 'walk', walkdog: 'walk', stadiumstairs: 'stairs', rowerintervals: 'rower', bikeintervals: 'bike', bikeerg: 'bike', spinclass: 'bike', ube: 'bike', bootcamp: 'metcon', aquajog: 'swim', trackfield: 'trackintervals'};
function tipsFor(e){
  if (TIPS[e.id]) return TIPS[e.id];
  if (TIPS_ALIAS[e.id] && TIPS[TIPS_ALIAS[e.id]]) return TIPS[TIPS_ALIAS[e.id]];
  const pat = PATTERNS.find(p => p[2].indexOf(e.id) >= 0), key = pat ? pat[0] : null, base = key && {squat: 'squat', hinge: 'rdl', push: 'bench', overhead: 'ohp', pull: 'row'}[key];
  if (base && TIPS[base]) return TIPS[base];
  const g = e.group, eq = e.eq;
  const setup = eq === 'machine' ? 'Set the seat so the pivot lines up with the joint that moves. Sit back into the pad, feet planted.' : eq === 'cable' ? 'Set the pulley so the cable pulls straight along the line of the movement. Stand or sit tall with the shoulders down.' : eq === 'dumbbell' ? 'Pick a weight you can control for every rep. Shoulders back, core braced before the first rep.' : eq === 'bodyweight' ? 'Set the body in one straight line, glutes and abs tight, before the first rep.' : eq === 'kettlebell' ? 'Grip the handle firmly, wrist straight, shoulder packed down.' : e.type === 'cardio' ? 'Start easy for a couple of minutes and build into the pace.' : 'Set up braced and stable before the first rep: feet planted, shoulders back.';
  const move = e.type === 'cardio' ? 'Hold a pace you can sustain for the planned time, breathing in a rhythm. Finish with a minute easy.' : g === 'Chest' ? 'Lower under control until you feel the chest stretch, press by bringing the upper arms toward each other, squeeze at the top.' : g === 'Back' ? 'Pull with the elbows leading, squeeze the shoulder blades at the end, return to a full stretch.' : g === 'Shoulders' ? 'Move slowly, lead with the elbows and keep the traps relaxed. Pause at the top.' : g === 'Arms' ? 'Keep the upper arm still and move only at the elbow. Squeeze at the peak, lower slowly.' : g === 'Legs' ? 'Control the way down, keep the knees tracking over the toes, drive through the whole foot.' : g === 'Core' ? 'Move slowly, exhale on the effort, keep the lower back from arching.' : 'Move under control through the full range. Two seconds down, one second up.';
  const pro = g === 'Chest' ? 'Think about the upper arms squeezing together, not the hands pressing. The chest is a squeezer.' : g === 'Back' ? 'Picture the hands as hooks and drive the elbows. The lats work when the elbows lead.' : g === 'Shoulders' ? 'Lead with the elbows and keep the shoulders down away from the ears.' : g === 'Arms' ? 'Slow the lowering phase to three seconds. That is where arms grow.' : g === 'Legs' ? 'Spread the floor with the feet and keep tension through the whole rep, never resting at the top.' : g === 'Core' ? 'Exhale fully and pull the ribs toward the hips. Breath is the connection.' : e.type === 'cardio' ? 'Easy sessions should feel easy. Save the effort for the days that ask for it.' : 'Feel the target muscle before the weight moves; if you cannot, lighten the load.';
  return [setup, move, pro];
}

/* ---------- cardio coach (section 8 of the plan, without effort signals): build to the planned time, then adapt once and nudge one variable ---------- */
function cardioHistory(exId, n){
  const out = [];
  for (const w of coachWorkouts()) { const en = w.entries.find(x => x.ex === exId && x.sets.length && x.sets.some(s => s.sec)); if (en) { const sets = en.sets.filter(s => s.sec); out.push({date: w.date, start: w.start, set: sets[sets.length - 1]}); if (out.length >= n) break; } }
  return out;
}
const near = (a, b, tol) => Math.abs((a || 0) - (b || 0)) <= tol;
function sameCardio(a, b){ if (!a || !b || !!a.ivl !== !!b.ivl) return false; if (a.ivl) { const pa = ivlPhases(a.ivl), pb = ivlPhases(b.ivl); return a.ivl.rounds === b.ivl.rounds && pa.length === pb.length && pa.every((p, k) => near(p.speed, pb[k].speed, 0.05) && near(p.incline, pb[k].incline, 0.1) && near(p.min, pb[k].min, 0.01)); } return near(a.sec, b.sec, Math.max(30, a.sec * 0.05)) && near(a.speed, b.speed, 0.05) && near(a.incline, b.incline, 0.1) && near(a.load, b.load, 2.6) && near(a.mi, b.mi, Math.max(0.05, (a.mi || 0) * 0.03)); }
function recommendCardio(exId, target){
  const e = ex(exId); if (e.type !== 'cardio') return null;
  const hist = cardioHistory(exId, 3), planned = target && target.min ? target.min : 0;
  const mk = (code, min, extra) => Object.assign({code: code, min: Math.max(1, Math.round(min))}, extra || {});
  if (!hist.length) return mk('FIRST', planned || 30, {speed: 0, incline: 0, mi: 0});
  const last = hist[0], s = last.set, lastMin = s.sec / 60, days = Math.round((Date.now() - last.start) / 86400000);
  const base = {speed: s.speed || 0, incline: s.incline || 0, mi: s.mi || 0, last: s, days: days};
  if (s.ivl) return null;
  if (days > 28) return mk('LAYOFF_LONG', lastMin * 0.8, Object.assign(base, {mi: s.mi ? Math.round(s.mi * 0.8 * 100) / 100 : 0}));
  if (days > 14) return mk('LAYOFF', lastMin, base);
  if (planned && lastMin < planned - 0.5) { const nm = Math.min(planned, lastMin + Math.min(5, lastMin * 0.1)); return mk('BUILD', nm, Object.assign(base, {planned: planned, mi: s.mi && s.sec ? Math.round(s.mi / s.sec * nm * 60 * 100) / 100 : 0})); }
  if (!hist[1]) return mk('ADAPT', lastMin, base);
  const l0 = setLoad(exId, hist[0].set).load, l1 = setLoad(exId, hist[1].set).load;
  if (l0 < l1 * 0.97) return mk('STEP_BACK', lastMin, base);
  if (l0 > l1 * 1.03) return mk('ADAPT', lastMin, base);
  const walk = WALK_IDS[e.id] || e.id === 'inclinewalk';
  if (s.speed) {
    if (walk && (s.incline || 0) < 15) return mk('INCLINE', lastMin, Object.assign(base, {incline: Math.round(((s.incline || 0) + 0.5) * 10) / 10, mi: 0}));
    return mk('SPEED', lastMin, Object.assign(base, {speed: Math.round((s.speed + (isKg() ? 0.2 : 0.1)) * 10) / 10, mi: 0}));
  }
  if (s.mi) { const step = isKg() ? 0.5 / KM_PER_MI : 0.25, nmi = Math.round((s.mi + step) * 100) / 100; return mk('DIST', s.sec / s.mi * nmi / 60, Object.assign(base, {mi: nmi})); }
  return mk('TIME', lastMin + 5, base);
}
function cardioWhy(r, e){
  const u = isKg() ? 'km/h' : 'mph', wk = Math.round((r.days || 0) / 7);
  switch (r.code) {
    case 'FIRST': return 'First time logged. Go easy and set the baseline.';
    case 'LIGHT': return 'Light day: three quarters of the usual time at an easy pace. Nothing today counts against the plan.';
    case 'LAYOFF_LONG': return wk + ' weeks off. Same effort, 20% shorter, and build back up.';
    case 'LAYOFF': return 'Two weeks off. Repeat the last session before adding anything.';
    case 'BUILD': return 'Building to the planned ' + r.planned + ' minutes first. Same effort, a little longer.';
    case 'ADAPT': return 'A step up last time. Repeat it once, then the next nudge.';
    case 'STEP_BACK': return 'Last one came in under the one before. Repeat it, then nudge.';
    case 'INCLINE': return 'Two steady sessions at this load. Incline goes first: up half a percent.';
    case 'SPEED': return 'Two steady sessions at this load. Speed up a notch to ' + r.speed + ' ' + u + '.';
    case 'DIST': return 'Two steady sessions at this load. A little further at the same pace.';
    case 'TIME': return 'Two steady sessions at this load. Five more minutes.';
    case 'PLAN': return 'As planned in your routine. Change it under Plan when you want a new target.';
  }
  return '';
}

/* ---------- sample data (first run only; cleared by "Start fresh") ---------- */
function sampleBodyweights(){ const out = [], rnd = mulberry32(7); let w = 184; for (let d = 56; d >= 0; d -= 7) { w = w - 0.4 + (rnd() - 0.5) * 1.2; const dt = addDays(new Date(), -d); dt.setHours(6, 40 + Math.floor(rnd() * 20), 0, 0); out.push({date: keyOf(dt), lb: Math.round(w * 10) / 10, t: dt.getTime()}); } return out; }
function mulberry32(a){ return function(){ a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function makeSample(s){
  const rnd = mulberry32(20260906);
  const base = {bench: 145, ohp: 85, incdb: 50, latraise: 20, pushdown: 50, row: 135, pulldown: 120, cablerow: 110, facepull: 40, curl: 60, squat: 185, rdl: 165, legpress: 270, legcurl: 90, calf: 120};
  const out = []; const today = new Date();
  for (let d = 56; d >= 1; d--) {
    const date = addDays(today, -d); const rid = (s.plan[date.getDay()] || [])[0]; if (!rid) continue;
    if (rnd() < 0.18) continue;
    const r = s.routines.find(x => x.id === rid); if (!r) continue;
    const prog = (56 - d) / 56;
    const start = new Date(date); start.setHours(6, 15 + Math.floor(rnd() * 50), 0, 0);
    let dur = 0;
    const entries = r.items.map(item => {
      const e = CAT[item.ex];
      if (e.type === 'cardio') {
        const sec = Math.round((26 + rnd() * 10) * 60);
        const paceSec = (9.7 - 0.7 * prog + (rnd() - 0.5) * 0.4) * 60;
        dur += sec;
        return {ex: item.ex, sets: [{sec: sec, mi: Math.round(sec / paceSec * 100) / 100}]};
      }
      const w = Math.round((base[item.ex] || 50) * (1 + 0.10 * prog + (rnd() - 0.5) * 0.04) / 5) * 5;
      const sets = [];
      const hi = item.hi || item.reps, good = rnd() < 0.35;
      for (let i = 0; i < item.sets; i++) { let reps = hi; if (!good) { if (i >= 1 && rnd() < 0.5) reps -= 1; if (i === item.sets - 1 && rnd() < 0.4) reps -= 1; } sets.push({w: w, r: Math.max(1, reps), tw: w, tr: item.reps}); }
      dur += item.sets * 150;
      return {ex: item.ex, sets: sets};
    });
    const end = start.getTime() + Math.round((dur + 300 + rnd() * 400) * 1000);
    out.push({id: uid(), date: keyOf(date), start: start.getTime(), end: end, routine: rid, name: r.name, entries: entries, prs: []});
  }
  assignPRs(out);
  return out;
}

