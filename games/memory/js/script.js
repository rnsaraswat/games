
// main javascript file 
import { startTimer,seconds, minutes, hours, timerInterval } from './timer.js';
// import { launchConfetti, stopConfetti } from './confetti.js';
import { playSound } from './sound.js';
// import { loadBest, saveBest } from './best_score.js';
import { themeToggle } from './theme.js';
import { textToSpeechEng } from './speak.js';
import { localrenderLeaderboard, saveToLeaderboard } from '../../../leaderboard/localleaderboard.js';
// import { saveToLeaderboard } from './leaderboard.js';
// import { timer } from './script.js';

export const levelSel = document.getElementById('level');
export const themeSel = document.getElementById('theme');
export let timer = false;
export let moves = 0; 
export let totalTiles = 0;

window.addEventListener('load', function () {
    const loading = document.getElementById('loading');
    loading.style.display = 'none';

// theme images used directly
const themes = {
    animals: ["dinosaur_allosaurus.jpg", "dinosaur_ankylosaurus.jpg", "dinosaur_apatosaurus.jpg", "dinosaur_archaeopteryx.jpg", "dinosaur_brachiosaurus.jpg", "dinosaur_brontosaurus.jpg", "dinosaur_coelophysis.jpg", "dinosaur_dilophosaurus.jpg", "dinosaur_elamosaurus.jpg", "dinosaur_parasaurolophus.jpg", "dinosaur_pteranodon.jpg", "dinosaur_spinosaurus.jpg", "dinosaur_stegosaurus.jpg", "dinosaur_t-rex.jpg", "dinosaur_triceratops.jpg", "dinosaur_velociraptor.jpg", "farm-animals_camel.jpg", "farm-animals_cat.jpg", "farm-animals_chicken.jpg", "farm-animals_cow.jpg", "farm-animals_dog.jpg", "farm-animals_donkey.jpg", "farm-animals_duck.jpg", "farm-animals_goat.jpg", "farm-animals_horse.jpg", "farm-animals_llama.jpg", "farm-animals_ox.jpg", "farm-animals_pig.jpg", "farm-animals_rabbit.jpg", "farm-animals_sheep.jpg", "farm-animals_turkey.jpg", "farm-animals_yak.jpg", "forests-animal_badger.jpg", "forests-animal_bear.jpg", "forests-animal_beaver.jpg", "forests-animal_bird.jpg", "forests-animal_boar.jpg", "forests-animal_bugs.jpg", "forests-animal_deer.jpg", "forests-animal_duck.jpg", "forests-animal_fox.jpg", "forests-animal_frog.jpg", "forests-animal_hedgehog.jpg", "forests-animal_mole.jpg", "forests-animal_otter.jpg", "forests-animal_owl.jpg", "forests-animal_rabbit.jpg", "forests-animal_raccoon.jpg", "forests-animal_skunk.jpg", "forests-animal_snake.jpg", "forests-animal_squrrel.jpg", "forests-animal_wolf.jpg", "Jungle-animal_anteater.jpg", "Jungle-animal_bat.jpg", "Jungle-animal_flamingo.jpg", "Jungle-animal_gorilla.jpg", "Jungle-animal_iguana.jpg", "Jungle-animal_lizard.jpg", "Jungle-animal_monkey.jpg", "Jungle-animal_panda.jpg", "Jungle-animal_parrot.jpg", "Jungle-animal_peacock.jpg", "Jungle-animal_sloth.jpg", "Jungle-animal_snake.jpg", "Jungle-animal_tiger.jpg", "Jungle-animal_toucon.jpg", "savanna-animal_alligator.jpg", "savanna-animal_elephant.jpg", "savanna-animal_giraffe.jpg", "savanna-animal_hippo.jpg", "savanna-animal_hyena.jpg", "savanna-animal_lion.jpg", "savanna-animal_ostrish.jpg", "savanna-animal_rhino.jpg", "savanna-animal_zebra.jpg", "wild-animals_bear.jpg", "wild-animals_deer.jpg", "wild-animals_elephant.jpg", "wild-animals_fox.jpg", "wild-animals_giraffe.jpg", "wild-animals_gorilla.jpg", "wild-animals_hippopotamus.jpg", "wild-animals_kangaroo.jpg", "wild-animals_koala.jpg", "wild-animals_leopardjpg.jpg", "wild-animals_lion.jpg", "wild-animals_monkey.jpg", "wild-animals_panda.jpg", "wild-animals_polarbear.jpg", "wild-animals_raccoon.jpg", "wild-animals_sloth.jpg", "wild-animals_snake.jpg", "wild-animals_squirrel.jpg", "wild-animals_tiger.jpg", "wild-animals_zebra.jpg", ],

    beach: ["beach_beach.jpg", "beach_beach-bag.jpg", "beach_beach-ball.jpg", "beach_bucket.jpg", "beach_camera.jpg", "beach_deck-chair.jpg", "beach_goggles.jpg", "beach_ice-box.jpg", "beach_ice-cream.jpg", "beach_parasol.jpg", "beach_sand.jpg", "beach_sand-castle.jpg", "beach_sea.jpg", "beach_seagull.jpg", "beach_shell.jpg", "beach_snorkel.jpg", "beach_soda.jpg", "beach_spade.jpg", "beach_sun.jpg", "beach_sunglass.jpg", "beach_sun-hat.jpg", "beach_sunscreen.jpg", "beach_sun-shelter.jpg", "beach_surfboard.jpg", "beach_swim-suit.jpg", "beach_swim-trunks.jpg", "party_balloons.jpg", "party_birthday-cake.jpg", "party_birthday-hat.jpg", "party_candles.jpg", "party_candy.jpg", "party_cookies.jpg", "party_guests.jpg", "party_music.jpg", "party_party.jpg", "party_present.jpg", ],

    bird: ["birds_bat.jpg", "birds_crow.jpg", "birds_dove.jpg", "birds_eagle.jpg", "birds_flamingo.jpg", "birds_goose.jpg", "birds_hawk.jpg", "birds_hummingbird.jpg", "birds_kiwi.jpg", "birds_nightingale.jpg", "birds_ostrich.jpg", "birds_owl.jpg", "birds_parrot.jpg", "birds_pigeon.jpg", "birds_quail.jpg", "birds_robin.jpg", "birds_rooster.jpg", "birds_seagull.jpg", "birds_sparrow.jpg", "birds_stork.jpg", "birds_swan.jpg", "birds_toucans.jpg", "birds_vulture.jpg", "birds_woodpecker.jpg", "insects_ant.jpg", "insects_beetle.jpg", "insects_butterfly.jpg", "insects_caterpillar.jpg", "insects_centipede.jpg", "insects_cockroach.jpg", "insects_cricket.jpg", "insects_dragonfly.jpg", "insects_fireflies.jpg", "insects_fly.jpg", "insects_grasshopper.jpg", "insects_honeybee.jpg", "insects_ladybug.jpg", "insects_mosquito.jpg", "insects_scorpion.jpg", "insects_spider.jpg", ],

    body: ["body-parts_arm.jpg", "body-parts_arms.jpg", "body-parts_body.jpg", "body-parts_ear.jpg", "body-parts_ears.jpg", "body-parts_elbow.jpg", "body-parts_elbows.jpg", "body-parts_eye.jpg", "body-parts_eyebrow.jpg", "body-parts_eyebrows.jpg", "body-parts_eyelash.jpg", "body-parts_eyelashes.jpg", "body-parts_eyes.jpg", "body-parts_face.jpg", "body-parts_feet.jpg", "body-parts_finger.jpg", "body-parts_fingers.jpg", "body-parts_foot.jpg", "body-parts_hair.jpg", "body-parts_hand.jpg", "body-parts_hands.jpg", "body-parts_head.jpg", "body-parts_knee.jpg", "body-parts_knees.jpg", "body-parts_leg.jpg", "body-parts_legs.jpg", "body-parts_lips.jpg", "body-parts_mouth.jpg", "body-parts_neck.jpg", "body-parts_nose.jpg", "body-parts_shoulder.jpg", "body-parts_shoulders.jpg", "body-parts_teeth.jpg", "body-parts_thumb.jpg", "body-parts_toes.jpg", "body-parts_tongue.jpg", "health_asthma.jpg", "health_backache.jpg", "health_broken-arm.jpg", "health_broken-leg.jpg", "health_cold.jpg", "health_cough.jpg", "health_cut.jpg", "health_earache.jpg", "health_fever.jpg", "health_headache.jpg", "health_nosebleed.jpg", "health_rash.jpg", "health_runny-nose.jpg", "health_sneeze.jpg", "health_sore-throat.jpg", "health_stomach-ache.jpg", "health_sunburn.jpg", "health_toothache.jpg", ],

    city: ["city_airport.jpg", "city_apartment.jpg", "city_bank.jpg", "city_barber-shop.jpg", "city_book-store.jpg", "city_burger-restaurant.jpg", "city_cafe.jpg", "city_candy-store.jpg", "city_church.jpg", "city_circus.jpg", "city_clinic.jpg", "city_clothing-store.jpg", "city_coffee-shop.jpg", "city_drug-store.jpg", "city_factory.jpg", "city_fire-station.jpg", "city_florist.jpg", "city_gas-station.jpg", "city_highway.jpg", "city_hospital.jpg", "city_hotel.jpg", "city_movie-theater.jpg", "city_museum.jpg", "city_pharmacy.jpg", "city_policestation.jpg", "city_postoffice.jpg", "city_restaurant.jpg", "city_school.jpg", "city_store.jpg", "city_super-market.jpg", "city_trainstation.jpg", "city_zoo.jpg", "places_arctic.jpg", "places_beach.jpg", "places_city.jpg", "places_desert.jpg", "places_farm.jpg", "places_forest.jpg", "places_mountains.jpg", "places_park.jpg", "places_sea.jpg", "places_space.jpg", ],

    clothing: ["clothing_apron.jpg", "clothing_back-pack.jpg", "clothing_bag.jpg", "clothing_bathrobe.jpg", "clothing_belt.jpg", "clothing_bikini.jpg", "clothing_blouse.jpg", "clothing_boots.jpg", "clothing_bow-tie.jpg", "clothing_bra.jpg", "clothing_brief-case.jpg", "clothing_bubble-coat.jpg", "clothing_cap.jpg", "clothing_coat.jpg", "clothing_cowboy-boots.jpg", "clothing_diaper.jpg", "clothing_dress.jpg", "clothing_gloves.jpg", "clothing_hand-bag.jpg", "clothing_hat.jpg", "clothing_high-heel-shoes.jpg", "clothing_hiking-boots.jpg", "clothing_hoody.jpg", "clothing_jacket.jpg", "clothing_jeans.jpg", "clothing_jersey.jpg", "clothing_jogger-paint.jpg", "clothing_kimono.jpg", "clothing_leotard.jpg", "clothing_mittens.jpg", "clothing_neckless.jpg", "clothing_necktie.jpg", "clothing_paints.jpg", "clothing_poncho.jpg", "clothing_purse.jpg", "clothing_ring.jpg", "clothing_sandals.jpg", "clothing_sari.jpg", "clothing_scarf.jpg", "clothing_shirt.jpg", "clothing_shoes.jpg", "clothing_shorts.jpg", "clothing_skirt.jpg", "clothing_slippers.jpg", "clothing_sneakers.jpg", "clothing_socks.jpg", "clothing_sombrero.jpg", "clothing_suit.jpg", "clothing_sunglass.jpg", "clothing_sweater.jpg", "clothing_swim-shorts.jpg", "clothing_swim-suit.jpg", "clothing_t-shirt.jpg", "clothing_turban.jpg", "clothing_underwear.jpg", "clothing_vest.jpg", "clothing_waist-coat.jpg", "clothing_wallet.jpg", "clothing_willinton-boots.jpg", "clothing_winter-hat.jpg", ],
    
    country: ["country_abkhazia.jpg", "country_afghanistan.jpg", "country_aland-islands.jpg", "country_albania.jpg", "country_algeria.jpg", "country_american-somoa.jpg", "country_andorra.jpg", "country_angola.jpg", "country_anguilla.jpg", "country_antigua-barbuda.jpg", "country_argentina.jpg", "country_armenia.jpg", "country_aruba.jpg", "country_australia.jpg", "country_austria.jpg", "country_azerbaijan.jpg", "country_azores-islands.jpg", "country_bahamas.jpg", "country_bahrain.jpg", "country_balearic-islands.jpg", "country_bangladesh.jpg", "country_barabados.jpg", "country_basquecountry.jpg", "country_belarus.jpg", "country_belgium.jpg", "country_belize.jpg", "country_benin.jpg", "country_bermuda.jpg", "country_bhutan.jpg", "country_bolivia.jpg", "country_bonaire.jpg", "country_bosnia-and-herzegovina.jpg", "country_botswana.jpg", "country_brazil.jpg", "country_british-columbia.jpg", "country_british-indian-ocean-ter.jpg", "country_british-vrigin-islands.jpg", "country_brunei.jpg", "country_bulgaria.jpg", "country_burkina-faso.jpg", "country_burundi.jpg", "country_cameroon.jpg", "country_canada.jpg", "country_canary-islands.jpg", "country_cape-verde.jpg", "country_cayman-island.jpg", "country_central-amrican-rupblic.jpg", "country_ceuta.jpg", "country_chad.jpg", "country_chile.jpg", "country_china.jpg", "country_christmas-island.jpg", "country_cocos-islands.jpg", "country_colombia.jpg", "country_combodia.jpg", "country_comoros.jpg", "country_cook-islands.jpg", "country_corsica.jpg", "country_costarica.jpg", "country_croatia.jpg", "country_cuba.jpg", "country_curacao.jpg", "country_cyprus.jpg", "country_czech-republic.jpg", "country_demo-rep-of-congo.jpg", "country_denmark.jpg", "country_djibouti.jpg", "country_dominica.jpg", "country_dominican-republic.jpg", "country_east-timor.jpg", "country_ecuador.jpg", "country_egypt.jpg", "country_el-salvador.jpg", "country_england.jpg", "country_equtorial-guinea.jpg", "country_eritrea.jpg", "country_estonia.jpg", "country_ethiopia.jpg", "country_european-union.jpg", "country_falkland-islands.jpg", "country_faroe-islands.jpg", "country_fiji.jpg", "country_finland.jpg", "country_france.jpg", "country_french-polynesia.jpg", "country_gabon.jpg", "country_galapagos-islands.jpg", "country_gambia.jpg", "country_georgia.jpg", "country_germany.jpg", "country_ghana.jpg", "country_gibraltar.jpg", "country_greece.jpg", "country_greenland.jpg", "country_grenada.jpg", "country_guam.jpg", "country_guernsey.jpg", "country_guinea.jpg", "country_guinea-bissau.jpg", "country_gutemala.jpg", "country_haiti.jpg", "country_hawaii.jpg", "country_honduras.jpg", "country_hong-kong.jpg", "country_hungary.jpg", "country_huwait.jpg", "country_iceland.jpg", "country_india.jpg", "country_indonesia.jpg", "country_iran.jpg", "country_iraq.jpg", "country_ireland.jpg", "country_isle-of-man.jpg", "country_israel.jpg", "country_italy.jpg", "country_ivory-coast.jpg", "country_jamaica.jpg", "country_japan.jpg", "country_jersey.jpg", "country_jordan.jpg", "country_kasovo.jpg", "country_kazakhstan.jpg", "country_kenya.jpg", "country_kiribati.jpg", "country_kuwait.jpg", "country_kyrgyzstan.jpg", "country_laos.jpg", "country_latvia.jpg", "country_lebanon.jpg", "country_lesotho.jpg", "country_liberia.jpg", "country_libya.jpg", "country_liechenstein.jpg", "country_lithuania.jpg", "country_luxembourg.jpg", "country_macao.jpg", "country_madagascar.jpg", "country_madeira.jpg", "country_malawi.jpg", "country_malaysia.jpg", "country_maldives.jpg", "country_mali.jpg", "country_malta.jpg", "country_marshall-island.jpg", "country_martinique.jpg", "country_mauritania.jpg", "country_mauriytus.jpg", "country_melilla.jpg", "country_mexico.jpg", "country_micronesia.jpg", "country_moldova.jpg", "country_monaco.jpg", "country_mondolia.jpg", "country_montanegro.jpg", "country_montserraut.jpg", "country_morocco.jpg", "country_mozambique.jpg", "country_myanmar.jpg", "country_nahrain.jpg", "country_nalearicislands.jpg", "country_namibia.jpg", "country_nato.jpg", "country_nauru.jpg", "country_nepal.jpg", "country_netherlands.jpg", "country_new-zealand.jpg", "country_nicaragua.jpg", "country_nigeria.jpg", "country_niue.jpg", "country_norfolk-islands.jpg", "country_northern-cyprus.jpg", "country_northern-marianas-island.jpg", "country_north-korea.jpg", "country_norway.jpg", "country_oman.jpg", "country_ossetia.jpg", "country_pakistan.jpg", "country_palau.jpg", "country_palestine.jpg", "country_panama.jpg", "country_papua-new-guinea.jpg", "country_paraguay.jpg", "country_peru.jpg", "country_philippines.jpg", "country_pitcairn-islands.jpg", "country_poland.jpg", "country_portugal.jpg", "country_puerto-rico.jpg", "country_qatar.jpg", "country_rapa-nui-ester-island.jpg", "country_rawanda.jpg", "country_repiblic-of-congo.jpg", "country_romania.jpg", "country_rupublic-of-macedonia.jpg", "country_russia.jpg", "country_saint-kitts-nevis.jpg", "country_saint-lucia.jpg", "country_samoa.jpg", "country_san-marino.jpg", "country_sao-tome-principe.jpg", "country_sardinia.jpg", "country_saudi-arabia.jpg", "country_scotland.jpg", "country_sebia.jpg", "country_senegal.jpg", "country_sicily.jpg", "country_sierra-leone.jpg", "country_singapore.jpg", "country_sinteustatius.jpg", "country_sint-eustatius.jpg", "country_slovakia.jpg", "country_soba-island.jpg", "country_solvenia.jpg", "country_solvowi-arab-demo-rep.jpg", "country_somalia.jpg", "country_somaliland.jpg", "country_south-africa.jpg", "country_south-korea.jpg", "country_south-sudan.jpg", "country_spain.jpg", "country_sri-lanka.jpg", "country_stbarts.jpg", "country_st-lucia.jpg", "country_sudan.jpg", "country_suriname.jpg", "country_swaziland.jpg", "country_sweden.jpg", "country_switzerland.jpg", "country_sychelles.jpg", "country_syria.jpg", "country_taiwan.jpg", "country_tajikistan.jpg", "country_tanzania.jpg", "country_thailand.jpg", "country_tibet.jpg", "country_togo.jpg", "country_tokelau.jpg", "country_tonga.jpg", "country_transnistria.jpg", "country_trinidad-and-tabago.jpg", "country_tunisia.jpg", "country_turkey.jpg", "country_turkmenistan.jpg", "country_turks-caicos.jpg", "country_tuvalu.jpg", "country_uganda.jpg", "country_ukraine.jpg", "country_uniated-states.jpg", "country_united-arab-emirates.jpg", "country_united-kingdom.jpg", "country_unitednations.jpg", "country_uruguay.jpg", "country_uzbekistan.jpg", "country_vanuatu.jpg", "country_vaticancity.jpg", "country_venezuela.jpg", "country_vietnam.jpg", "country_vincent-grenadines.jpg", "country_virginislands.jpg", "country_wales.jpg", "country_yemen.jpg", "country_zambia.jpg", "country_zimbabwe.jpg", "country-poland.jpg", "country-scotland-00203.jpg", "country-sinteustatius-00210.jpg", ],

    Emoji: ["Emogi_01.png", "Emogi_02.png", "Emogi_03.png", "Emogi_04.png", "Emogi_05.png", "Emogi_06.png", "Emogi_07.png", "Emogi_08.png", "Emogi_09.png", "Emogi_10.png", "Emogi_11.png", "Emogi_12.png", "Emogi_13.png", "Emogi_14.png", "Emogi_15.png", "Emogi_16.png", "Emogi_17.png", "Emogi_18.png", "Emogi_19.png", "Emogi_20.png", "Emogi_21.png", "Emogi_22.png", "Emogi_23.png", "Emogi_24.png", "Emogi_25.png", "Emogi_26.png", "Emogi_27.png", "Emogi_28.png", "Emogi_29.png", "Emogi_30.png", "Emogi_31.png", "Emogi_32.png", "Emogi_33.png", "Emogi_34.png", "Emogi_35.png", "Emogi_36.png", "Emogi_37.png", "Emogi_38.png", "Emogi_39.png", "Emogi_40.png", "Emogi_41.png", "Emogi_42.png", "Emogi_43.png", "Emogi_44.png", "Emogi_45.png", "Emogi_46.png", "Emogi_47.png", "Emogi_48.png", "Emogi_49.png", "Emogi_50.png", "Emogi_51.png", "Emogi_52.png", "Emogi_53.png", "Emogi_54.png", ],

    food: ["drink_apple-juice.jpg", "drink_beer.jpg", "drink_cocktail.jpg", "drink_coffee.jpg", "drink_cola.jpg", "drink_grape-juice.jpg", "drink_green-tea.jpg", "drink_hot-chocalte.jpg", "drink_kiwi-juice.jpg", "drink_lemonade.jpg", "drink_lemon-juice.jpg", "drink_lime-juice.jpg", "drink_melon-juice.jpg", "drink_milk.jpg", "drink_milkshake.jpg", "drink_orange-juice.jpg", "drink_peach-juice.jpg", "drink_soda.jpg", "drink_strowberry-juice.jpg", "drink_tea.jpg", "drink_tomoto-juice.jpg", "drink_water.jpg", "drink_watermelon-juice.jpg", "drink_wine.jpg", "food_apple-pie.jpg", "food_bacon.jpg", "food_bread.jpg", "food_burger.jpg", "food_cake.jpg", "food_candy.jpg", "food_caramel-pudding.jpg", "food_cereal.jpg", "food_cheese.jpg", "food_chicken.jpg", "food_chocolate.jpg", "food_chocolate-brownie.jpg", "food_cookie.jpg", "food_corndog.jpg", "food_crisp.jpg", "food_croissant.jpg", "food_cupcake.jpg", "food_curry.jpg", "food_donut.jpg", "food_egg.jpg", "food_fish.jpg", "food_fries.jpg", "food_greavy.jpg", "food_gyoza.jpg", "food_ham.jpg", "food_honey.jpg", "food_hot-dog.jpg", "food_ice-cream.jpg", "food_jelly.jpg", "food_mashed-patato.jpg", "food_meata-balls.jpg", "food_miso-soup.jpg", "food_noodles.jpg", "food_omelet.jpg", "food_pancakes.jpg", "food_pasta.jpg", "food_peanut-butter.jpg", "food_pickles.jpg", "food_pie.jpg", "food_pizza.jpg", "food_popcorn.jpg", "food_popsicle.jpg", "food_pretzel.jpg", "food_pumpkin-pie.jpg", "food_quesadillas.jpg", "food_ribs.jpg", "food_rice.jpg", "food_salad.jpg", "food_sandwich.jpg", "food_sausage.jpg", "food_shishkebab.jpg", "food_soup.jpg", "food_spaghetti.jpg", "food_squid.jpg", "food_steak.jpg", "food_stew.jpg", "food_sushi.jpg", "food_taco.jpg", "food_tofu.jpg", "food_tortilla.jpg", "food_waffles.jpg", "food_yogurt.jpg", ],

    hall: ["halloween_balck-cat.jpg", "halloween_bat.jpg", "halloween_candle.jpg", "halloween_candy.jpg", "halloween_coffin.jpg", "halloween_couldran.jpg", "halloween_crow.jpg", "halloween_death.jpg", "halloween_devil.jpg", "halloween_frankenstein.jpg", "halloween_ghost.jpg", "halloween_haunted-house.jpg", "halloween_invisible-man.jpg", "halloween_monster.jpg", "halloween_moon.jpg", "halloween_mummy.jpg", "halloween_pumpkin.jpg", "halloween_pumpkin-pie.jpg", "halloween_skeleton.jpg", "halloween_skull.jpg", "halloween_spider.jpg", "halloween_spider-web.jpg", "halloween_tombstone.jpg", "halloween_vampire.jpg", "halloween_voodoo-doll.jpg", "halloween_were-wolf.jpg", "halloween_witch.jpg", "halloween_zombie.jpg", ],

    hero: ["hero01.jpg", "hero02.jpg", "hero03.jpg", "hero04.jpg", "hero05.jpg", "hero06.jpg", "hero07.jpg", "hero08.jpg", "hero09.jpg", "hero10.jpg", "hero11.jpg", "hero12.jpg", "hero13.jpg", "hero14.avif", "hero15.avif", "hero16.avif", "hero17.jpg", "hero18.jpg", "hero19.jpg", "hero20.jpg", "hero21.jpg", "hero22.jpg", "hero23.jpg", "hero24.jpg", "hero25.jpg", "hero26.jpg", "hero27.jpg", "hero28.jpg", "hero29.jpg", "hero30.jpg", "hero31.jpg", "hero32.jpg", "hero33.jpg", "hero34.jpg", "hero35.jpg", "hero36.jpg", "hero37.jpg", "hero38.jpg", "hero39.jpg", "hero40.jpg", "hero41.jpg", "hero42.jpg", "hero43.jpg", "hero44.jpg", "hero45.jpg", "hero46.jpg", "hero47.jpg", "hero48.jpg", "hero49.jpg", "hero50.jpg", "hero51.jpg", "hero52.jpg", "hero53.jpg", "hero54.jpg", "hero55.jpg", "hero56.jpg", "hero57.jpg", "hero58.jpg", "hero59.jpg", "hero60.jpg", "hero61.jpg", "hero62.webp", "hero63.webp", "hero64.webp", "hero65.webp", "hero66.jpg", "hero67.jpg", "hero68.jpg", "hero69.jpg", "hero70.webp", "hero71.webp", "hero72.jpg", "hero73.webp", "hero74.jpg", ],

    houses: ["house_attic.jpg", "house_basement.jpg", "house_bathroom.jpg", "house_bedroom.jpg", "house_dining-room.jpg", "house_garage.jpg", "house_garden.jpg", "house_hallway.jpg", "house_house.jpg", "house_kitchen.jpg", "house_laundry-room.jpg", "house_living-room.jpg", "house_study.jpg", ],

    heroin: ["heroin01.jpg", "heroin02.jpg", "heroin03.jpg", "heroin04.jpg", "heroin05.jpg", "heroin06.jpg", "heroin07.jpg", "heroin08.jpg", "heroin09.jpg", "heroin10.jpg", "heroin11.jpg", "heroin12.jpg", "heroin13.jpg", "heroin14.jpg", "heroin15.jpg", "heroin16.jpg", "heroin17.jpg", "heroin18.jpg", "heroin19.jpg", "heroin20.webp", "heroin21.jpg", "heroin22.jpg", "heroin23.webp", "heroin24.webp", "heroin25.jpg", "heroin26.jpg", "heroin27.webp", "heroin28.gif", "heroin29.jpg", "heroin30.jpg", "heroin31.jpg", "heroin32.webp", "heroin33.webp", "heroin34.jpg", "heroin35.jpg", "heroin36.jpg", "heroin37.jpg", "heroin38.jpg", "heroin39.jpg", "heroin40.jpg", "heroin41.jpg", "heroin42.png", "heroin43.jpg", "heroin44.jpg", "heroin45.jpg", "heroin46.jpg", "heroin47.webp", "heroin48.jpg", "heroin49.jpg", "heroin50.jpg", "heroin51.jpg", "heroin52.jpg", "heroin53.jpg", "heroin54.jpg", "heroin55.jpg", "heroin56.jpg", "heroin57.jpg", "heroin58.webp", "heroin59.webp", "heroin60.webp", "heroin61.webp", "heroin62.jpg", "heroin63.jpg", "heroin64.jpg", "heroin65.jpg", "heroin66.webp", "heroin67.webp", "heroin68.jpg", "heroin69.jpg", "heroin70.jpg", "heroin71.jpg", "heroin72.jpg", "heroin73.jpg", "heroin74.jpg", "heroin75.jpg", "heroin76.jpg", "heroin77.jpg", "heroin78.jpg", "heroin79.jpg", "heroin80.jpg", "heroin81.jpg", "heroin82.jpg", ],

    items: ["bathroom_bath-mat.jpg", "bathroom_bathroom.jpg", "bathroom_bath-tub.jpg", "bathroom_brush.jpg", "bathroom_comb.jpg", "bathroom_dental-floss.jpg", "bathroom_hair-dryer.jpg", "bathroom_hand-towel.jpg", "bathroom_lotion.jpg", "bathroom_make-up.jpg", "bathroom_mirror.jpg", "bathroom_mouth-wash.jpg", "bathroom_q-tip.jpg", "bathroom_razor.jpg", "bathroom_saving-foam.jpg", "bathroom_shampoo.jpg", "bathroom_shop.jpg", "bathroom_shower.jpg", "bathroom_sink.jpg", "bathroom_sponge.jpg", "bathroom_tap.jpg", "bathroom_toilet.jpg", "bathroom_toilet-paper.jpg", "bathroom_tooth-brush.jpg", "bathroom_tooth-paste.jpg", "bathroom_towels.jpg", "bedroom_bed.jpg", "bedroom_bedroom.jpg", "bedroom_blanket.jpg", "bedroom_chair.jpg", "bedroom_clock.jpg", "bedroom_closet.jpg", "bedroom_curtains.jpg", "bedroom_dresser.jpg", "bedroom_dressing-table.jpg", "bedroom_fan.jpg", "bedroom_hanger.jpg", "bedroom_lamp.jpg", "bedroom_mirror.jpg", "bedroom_pillow.jpg", "bedroom_poster.jpg", "bedroom_rug.jpg", "bedroom_shelf.jpg", "bedroom_slippers.jpg", "bedroom_toys.jpg", "bedroom_TV.jpg", "bedroom_window.jpg", "house_bathroom.jpg", "house_living-room.jpg", "kitchen_apron.jpg", "kitchen_blender.jpg", "kitchen_bowl.jpg", "kitchen_bread-bin.jpg", "kitchen_calander.jpg", "kitchen_can-opener.jpg", "kitchen_chop-sticks.jpg", "kitchen_coffee-maker.jpg", "kitchen_cup.jpg", "kitchen_cuttong-board.jpg", "kitchen_dish-wahser.jpg", "kitchen_dryer.jpg", "kitchen_faucet.jpg", "kitchen_fork.jpg", "kitchen_freezer.jpg", "kitchen_greater.jpg", "kitchen_kettle.jpg", "kitchen_kitchen.jpg", "kitchen_kitchen-counter.jpg", "kitchen_knife.jpg", "kitchen_ladle.jpg", "kitchen_measuring-mug.jpg", "kitchen_microwave.jpg", "kitchen_mug.jpg", "kitchen_oven.jpg", "kitchen_oven-glove.jpg", "kitchen_pan.jpg", "kitchen_plate.jpg", "kitchen_pot.jpg", "kitchen_refrigerator.jpg", "kitchen_rolling-pin.jpg", "kitchen_sink.jpg", "kitchen_spooen.jpg", "kitchen_tea-cup.jpg", "kitchen_tea-pot.jpg", "kitchen_toaster.jpg", "kitchen_trash-can.jpg", "kitchen_wahsing-machine.jpg", "kitchen_whisk.jpg", "kitchen_wooden-spoon.jpg", "living-room_arm-chair.jpg", "living-room_book-case.jpg", "living-room_carpet.jpg", "living-room_chair.jpg", "living-room_coffee-table.jpg", "living-room_curtains.jpg", "living-room_cushion.jpg", "living-room_door.jpg", "living-room_fireplace.jpg", "living-room_lamp.jpg", "living-room_laptop.jpg", "living-room_living-room.jpg", "living-room_plant.jpg", "living-room_rug.jpg", "living-room_shelf.jpg", "living-room_sofa.jpg", "living-room_table.jpg", "living-room_tablet.jpg", "living-room_telephone.jpg", "living-room_TV.jpg", "living-room_vase.jpg", "living-room_window.jpg", ],

    Number: ['numbers_eight.jpg', 'numbers_eighteen.jpg', 'numbers_eighty.jpg', 'numbers_eighty-eight.jpg', 'numbers_eighty-five.jpg', 'numbers_eighty-four.jpg', 'numbers_eighty-nine.jpg', 'numbers_eighty-one.jpg', 'numbers_eighty-seven.jpg', 'numbers_eighty-six.jpg', 'numbers_eighty-three.jpg', 'numbers_eighty-two.jpg', 'numbers_eleven.jpg', 'numbers_fifteen.jpg', 'numbers_fifty.jpg', 'numbers_fifty-eight.jpg', 'numbers_fifty-five.jpg', 'numbers_fifty-four.jpg', 'numbers_fifty-nine.jpg', 'numbers_fifty-one.jpg', 'numbers_fifty-seven.jpg', 'numbers_fifty-six.jpg', 'numbers_fifty-three.jpg', 'numbers_fifty-two.jpg', 'numbers_five.jpg', 'numbers_forty.jpg', 'numbers_forty-eight.jpg', 'numbers_forty-five.jpg', 'numbers_forty-four.jpg', 'numbers_forty-nine.jpg', 'numbers_forty-one.jpg', 'numbers_forty-seven.jpg', 'numbers_forty-six.jpg', 'numbers_forty-three.jpg', 'numbers_forty-two.jpg', 'numbers_four.jpg', 'numbers_fourteen.jpg', 'numbers_nine.jpg', 'numbers_nineteen.jpg', 'numbers_ninety.jpg', 'numbers_ninety-eight.jpg', 'numbers_ninety-five.jpg', 'numbers_ninety-four.jpg', 'numbers_ninety-nine.jpg', 'numbers_ninety-one.jpg', 'numbers_ninety-seven.jpg', 'numbers_ninety-six.jpg', 'numbers_ninety-three.jpg', 'numbers_ninety-two.jpg', 'numbers_one.jpg', 'numbers_one-hunderd.jpg', 'numbers_seven.jpg', 'numbers_seventeen.jpg', 'numbers_seventy.jpg', 'numbers_seventy-eight.jpg', 'numbers_seventy-five.jpg', 'numbers_seventy-four.jpg', 'numbers_seventy-nine.jpg', 'numbers_seventy-one.jpg', 'numbers_seventy-seven.jpg', 'numbers_seventy-six.jpg', 'numbers_seventy-three.jpg', 'numbers_seventy-two.jpg', 'numbers_six.jpg', 'numbers_sixteen.jpg', 'numbers_sixty.jpg', 'numbers_sixty-eight.jpg', 'numbers_sixty-five.jpg', 'numbers_sixty-four.jpg', 'numbers_sixty-nine.jpg', 'numbers_sixty-one.jpg', 'numbers_sixty-seven.jpg', 'numbers_sixty-six.jpg', 'numbers_sixty-three.jpg', 'numbers_sixty-two.jpg', 'numbers_ten.jpg', 'numbers_thirteen.jpg', 'numbers_thirty.jpg', 'numbers_thirty-eight.jpg', 'numbers_thirty-five.jpg', 'numbers_thirty-four.jpg', 'numbers_thirty-nine.jpg', 'numbers_thirty-one.jpg', 'numbers_thirty-seven.jpg', 'numbers_thirty-six.jpg', 'numbers_thirty-three.jpg', 'numbers_thirty-two.jpg', 'numbers_three.jpg', 'numbers_twelve.jpg', 'numbers_twenty.jpg', 'numbers_twenty-eight.jpg', 'numbers_twenty-five.jpg', 'numbers_twenty-four.jpg', 'numbers_twenty-nine.jpg', 'numbers_twenty-one.jpg', 'numbers_twenty-seven.jpg', 'numbers_twenty-six.jpg', 'numbers_twenty-three.jpg', 'numbers_twenty-two.jpg', 'numbers_two.jpg',],

    occu: ["feelings_angery.jpg", "feelings_clam.jpg", "feelings_confused.jpg", "feelings_crying.jpg", "feelings_disappointed.jpg", "feelings_disgusted.jpg", "feelings_excited.jpg", "feelings_jealous.jpg", "feelings_loving.jpg", "feelings_nervous.jpg", "feelings_proud.jpg", "feelings_sad.jpg", "feelings_scared.jpg", "feelings_shy.jpg", "feelings_sick.jpg", "feelings_silly.jpg", "feelings_smiling.jpg", "feelings_surprised.jpg", "feelings_tired.jpg", "feelings_worried.jpg", "occupations_archeologist.jpg", "occupations_artist.jpg", "occupations_astronaut.jpg", "occupations_ballerina.jpg", "occupations_barber.jpg", "occupations_beautician.jpg", "occupations_builder.jpg", "occupations_cashier.jpg", "occupations_chef.jpg", "occupations_cleaner.jpg", "occupations_clown.jpg", "occupations_dentist.jpg", "occupations_director.jpg", "occupations_doctor.jpg", "occupations_farmer.jpg", "occupations_fire-fighter.jpg", "occupations_fitness-instructor.jpg", "occupations_florist.jpg", "occupations_football-player.jpg", "occupations_gardener.jpg", "occupations_helicopter-pilot.jpg", "occupations_miner.jpg", "occupations_nurse.jpg", "occupations_pilot.jpg", "occupations_plumber.jpg", "occupations_police-officer.jpg", "occupations_race-car-driver.jpg", "occupations_scientist.jpg", "occupations_scuba-driver.jpg", "occupations_sheriff.jpg", "occupations_soldier.jpg", "occupations_surgeon.jpg", "occupations_texi-driver.jpg", "occupations_train-driver.jpg", "occupations_veterinarian.jpg", "occupations_waiter.jpg", "occupations_welder.jpg", ],

    ocen: ["ocen-animals_catfish.jpg", "ocen-animals_clownfish.jpg", "ocen-animals_crab.jpg", "ocen-animals_dolphin.jpg", "ocen-animals_electriceel.jpg", "ocen-animals_jellyfish.jpg", "ocen-animals_lobster.jpg", "ocen-animals_narwhal.jpg", "ocen-animals_octopus.jpg", "ocen-animals_otter.jpg", "ocen-animals_oyster.jpg", "ocen-animals_penguin.jpg", "ocen-animals_platypus.jpg", "ocen-animals_seahorse.jpg", "ocen-animals_seal.jpg", "ocen-animals_sealion.jpg", "ocen-animals_shark.jpg", "ocen-animals_shrimp.jpg", "ocen-animals_squid.jpg", "ocen-animals_starfish.jpg", "ocen-animals_stingray.jpg", "ocen-animals_turtle.jpg", "ocen-animals_walrus.jpg", "ocen-animals_whale.jpg", "sea-animal_crab.jpg", "sea-animal_dolphin.jpg", "sea-animal_eel.jpg", "sea-animal_fish.jpg", "sea-animal_jelly-fish.jpg", "sea-animal_lobster.jpg", "sea-animal_octopus.jpg", "sea-animal_plankton.jpg", "sea-animal_seagull.jpg", "sea-animal_sea-horse.jpg", "sea-animal_seal.jpg", "sea-animal_sea-turtle.jpg", "sea-animal_shark.jpg", "sea-animal_shrimp.jpg", "sea-animal_squid.jpg", "sea-animal_starfish.jpg", "sea-animal_stingray.jpg", "sea-animal_sword-fish.jpg", "sea-animal_urchin.jpg", "sea-animal_whale.jpg", "sea-animal_x-ray-fish.jpg", ],

    past: ["past-tense_brush-brushed.jpg", "past-tense_build-built.jpg", "past-tense_catch-caught.jpg", "past-tense_clean-cleaned.jpg", "past-tense_climb-climbed.jpg", "past-tense_close-closed.jpg", "past-tense_cook-cooked.jpg", "past-tense_cut-cut.jpg", "past-tense_draw-drew.jpg", "past-tense_drink-drank.jpg", "past-tense_drive-drove.jpg", "past-tense_eat-ate.jpg", "past-tense_fix-fixed.jpg", "past-tense_give-gave.jpg", "past-tense_go-to-went-to.jpg", "past-tense_have-had.jpg", "past-tense_kick-kicked.jpg", "past-tense_like-liked.jpg", "past-tense_love-loved.jpg", "past-tense_make-made.jpg", "past-tense_mix-mixed.jpg", "past-tense_open-opened.jpg", "past-tense_paint-painted.jpg", "past-tense_plant-planted.jpg", "past-tense_play-palyed.jpg", "past-tense_pull-pulled.jpg", "past-tense_punch-punched.jpg", "past-tense_push-pushed.jpg", "past-tense_read-read.jpg", "past-tense_run-ran.jpg", "past-tense_see-saw.jpg", "past-tense_sing-sang.jpg", "past-tense_sit-sat.jpg", "past-tense_sleep-slept.jpg", "past-tense_stand-stood.jpg", "past-tense_stroke-stroked.jpg", "past-tense_study-studied.jpg", "past-tense_swim-swan.jpg", "past-tense_take-took.jpg", "past-tense_talk-talked.jpg", "past-tense_tell-told.jpg", "past-tense_think-thought.jpg", "past-tense_throw-threw.jpg", "past-tense_tie-tied.jpg", "past-tense_turn-off-turned-off.jpg", "past-tense_turn-on-turned-on.jpg", "past-tense_walk-walked.jpg", "past-tense_want-wanted.jpg", "past-tense_wash-washed.jpg", "past-tense_watch-watched.jpg", "past-tense_wear-wore.jpg", "past-tense_write-wrote.jpg", ],

    planet: ["planet_alien.jpg", "planet_asteroid.jpg", "planet_astronaut.jpg", "planet_comet.jpg", "planet_constellation.jpg", "planet_earth.jpg", "planet_jupiter.jpg", "planet_mars.jpg", "planet_mercury.jpg", "planet_meteor.jpg", "planet_moon.jpg", "planet_neptue.jpg", "planet_observatory.jpg", "planet_pluto.jpg", "planet_rocket.jpg", "planet_satellite.jpg", "planet_saturn.jpg", "planet_space.jpg", "planet_space-helnet.jpg", "planet_space-shuttle.jpg", "planet_space-station.jpg", "planet_space-suit.jpg", "planet_star.jpg", "planet_sun.jpg", "planet_telescope.jpg", "planet_ufo.jpg", "planet_uranus.jpg", "planet_venus.jpg", ],

    plant: ["plant_bark.jpg", "plant_branch.jpg", "plant_bush.jpg", "plant_flowers.jpg", "plant_garden.jpg", "plant_leaves.jpg", "plant_petal.jpg", "plant_petals.jpg", "plant_rain.jpg", "plant_roots.jpg", "plant_seed.jpg", "plant_seeds.jpg", "plant_soil.jpg", "plant_sprout.jpg", "plant_stem.jpg", "plant_sun.jpg", "plant_tree.jpg", "plant_tree-leaves.jpg", "plant_tree-roots.jpg", "plant_trunk.jpg", "plant_wind.jpg", ],

    playground: ["amusement-park_amusement-park.jpg", "amusement-park_boat-swing.jpg", "amusement-park_bouncy-castle.jpg", "amusement-park_bumper-cars.jpg", "amusement-park_chair-swing.jpg", "amusement-park_cup-and-saucer.jpg", "amusement-park_ferris-wheel.jpg", "amusement-park_go-karts.jpg", "amusement-park_hunted-house.jpg", "amusement-park_merry-go-round.jpg", "amusement-park_roller-coaster.jpg", "amusement-park_ticket-booth.jpg", "playground_bench.jpg", "playground_drink-fountain.jpg", "playground_jungle-gym.jpg", "playground_merry-go-round.jpg", "playground_monkey-bars.jpg", "playground_picnic-table.jpg", "playground_playground.jpg", "playground_sand-box.jpg", "playground_see-saw.jpg", "playground_slide.jpg", "playground_spring-rider.jpg", "playground_swing.jpg", "playground_tunnel.jpg", "playground_zipline.jpg", "sports_american-football.jpg", "sports_archery.jpg", "sports_badminton.jpg", "sports_baseball.jpg", "sports_basketball.jpg", "sports_bowling.jpg", "sports_boxing.jpg", "sports_cricket.jpg", "sports_darts.jpg", "sports_fencing.jpg", "sports_fishing.jpg", "sports_football.jpg", "sports_foot-ball.jpg", "sports_golf.jpg", "sports_ice-hocky.jpg", "sports_ice-skating.jpg", "sports_inline-skating.jpg", "sports_jodo.jpg", "sports_karate.jpg", "sports_pool.jpg", "sports_rock-climbing.jpg", "sports_rowing.jpg", "sports_rugby.jpg", "sports_sailing.jpg", "sports_show-jumping.jpg", "sports_skating.jpg", "sports_skiing.jpg", "sports_snowboarding.jpg", "sports_soccer.jpg", "sports_surfing.jpg", "sports_swimming.jpg", "sports_sycling.jpg", "sports_teble-tennis.jpg", "sports_tennis.jpg", "sports_volleyball.jpg", "sports_wrestling.jpg", ],

    social: ["activity_climbing.jpg", "activity_cooking.jpg", "activity_dancing.jpg", "activity_drinking.jpg", "activity_eating.jpg", "activity_hiking.jpg", "activity_jogging.jpg", "activity_playing.jpg", "activity_reading.jpg", "activity_riding.jpg", "activity_running.jpg", "activity_singing.jpg", "activity_sleeping.jpg", "activity_studying.jpg", "activity_watching-tv.jpg", "cat-prepositions_above.jpg", "cat-prepositions_behind.jpg", "cat-prepositions_below.jpg", "cat-prepositions_between.jpg", "cat-prepositions_by.jpg", "cat-prepositions_in.jpg", "cat-prepositions_in-front-of.jpg", "cat-prepositions_on.jpg", "cat-prepositions_under.jpg", "month_april.jpg", "month_august.jpg", "month_december.jpg", "month_february.jpg", "month_january.jpg", "month_july.jpg", "month_june.jpg", "month_march.jpg", "month_may.jpg", "month_november.jpg", "month_october.jpg", "month_september.jpg", "season_autumn.jpg", "season_fall.jpg", "season_spring.jpg", "season_summer.jpg", "season_winter.jpg", "social-skill_apologizing.jpg", "social-skill_asking-for-help.jpg", "social-skill_asking-for-permission.jpg", "social-skill_best-efforts.jpg", "social-skill_cleanup.jpg", "social-skill_following-directions.jpg", "social-skill_good-hygiene.jpg", "social-skill_having-a-positive-attitude.jpg", "social-skill_listening.jpg", "social-skill_respecting-personal-space.jpg", "social-skill_sharing.jpg", "social-skill_taking-turns.jpg", "social-skill_use-polite-words.jpg", "social-skill_using-manners.jpg", "social-skill_wating-and-being-patient.jpg", "social-skill_working-with-others.jpg", "weather_cloudy.jpg", "weather_rainy.jpg", "weather_snowy.jpg", "weather_strmy.jpg", "weather_sunny.jpg", "weather_windy.jpg", "weather-cloudy_1-0001.jpg", "weather-rainy_1-0002.jpg", "weather-snowy_3-0003.jpg", "weather-stormy_3-0004.jpg", "weather-sunny_3-0005.jpg", "weather-windy_3-0006.jpg", ],

    toy: ["colors_black.jpg", "colors_blue.jpg", "colors_brown.jpg", "colors_golden.jpg", "colors_gray.jpg", "colors_green.jpg", "colors_lilac.jpg", "colors_navy-blue.jpg", "colors_orange.jpg", "colors_pink.jpg", "colors_purple.jpg", "colors_red.jpg", "colors_silver.jpg", "colors_sky-blue.jpg", "colors_turquoise.jpg", "colors_white.jpg", "colors_yellow.jpg", "shape_circle.jpg", "shape_crescent.jpg", "shape_diamond.jpg", "shape_heart.jpg", "shape_hexagon.jpg", "shape_oval.jpg", "shape_pentagon.jpg", "shape_rectangle.jpg", "shape_square.jpg", "shape_star.jpg", "shape_triangle.jpg", "toy_aeroplane.jpg", "toy_baby-doll.jpg", "toy_ball.jpg", "toy_bicyle.jpg", "toy_block-game.jpg", "toy_blocks.jpg", "toy_board-game.jpg", "toy_bouncing-toy.jpg", "toy_building-blocks.jpg", "toy_card-game.jpg", "toy_dinosaur.jpg", "toy_doll.jpg", "toy_figurine.jpg", "toy_inline-skates.jpg", "toy_jump-rope.jpg", "toy_modeling-clay.jpg", "toy_puzzle.jpg", "toy_RC-car.jpg", "toy_robot.jpg", "toy_scooter.jpg", "toy_skate-board.jpg", "toy_swiming-pool.jpg", "toy_tablet.jpg", "toy_taddy-baer.jpg", "toy_toy-car.jpg", "toy_toy-truck.jpg", "toy_video-game.jpg", ],

    transport: ["transportaion_aeroplane.jpg", "transportaion_ambulance.jpg", "transportaion_bicycle.jpg", "transportaion_boat.jpg", "transportaion_buggy.jpg", "transportaion_bus.jpg", "transportaion_cable-car.jpg", "transportaion_camper-van.jpg", "transportaion_car.jpg", "transportaion_cement-truck.jpg", "transportaion_child-scooter.jpg", "transportaion_cruise-ship.jpg", "transportaion_dump-truck.jpg", "transportaion_excavator.jpg", "transportaion_ferry.jpg", "transportaion_fire-truck.jpg", "transportaion_forklift.jpg", "transportaion_garbage-truck.jpg", "transportaion_helicopter.jpg", "transportaion_hot-air-balloon.jpg", "transportaion_jeep.jpg", "transportaion_jet-ski.jpg", "transportaion_monster-truck.jpg", "transportaion_motorcycle.jpg", "transportaion_pickup-truck.jpg", "transportaion_pirate-ship.jpg", "transportaion_police-car.jpg", "transportaion_quad-bike.jpg", "transportaion_rocket.jpg", "transportaion_satellte.jpg", "transportaion_school-bus.jpg", "transportaion_scooter.jpg", "transportaion_skate-board.jpg", "transportaion_speed-boat.jpg", "transportaion_submarine.jpg", "transportaion_subway.jpg", "transportaion_tank.jpg", "transportaion_taxi.jpg", "transportaion_tractor.jpg", "transportaion_train.jpg", "transportaion_tricycle.jpg", "transportaion_truck.jpg", "transportaion_tuc-tuc.jpg", "transportaion_ufo.jpg", "transportaion_unicycle.jpg", "transportaion_van.jpg", "transportaion_wagon.jpg", ],

    vegetable: ["fruit_apple.jpg", "fruit_avocado.jpg", "fruit_banana.jpg", "fruit_cherry.jpg", "fruit_coconut.jpg", "fruit_grapefruit.jpg", "fruit_grapes.jpg", "fruit_kiwi.jpg", "fruit_lemon.jpg", "fruit_lime.jpg", "fruit_mango.jpg", "fruit_melon.jpg", "fruit_orange.jpg", "fruit_papaya.jpg", "fruit_peach.jpg", "fruit_pear.jpg", "fruit_pineapple.jpg", "fruit_plum.jpg", "fruit_pomegranate.jpg", "fruit_raspberry.jpg", "fruit_strowberry.jpg", "fruit_watermelon.jpg", "vegetable_asparagus.jpg", "vegetable_avocado.jpg", "vegetable_beets.jpg", "vegetable_broccoli.jpg", "vegetable_cabbage.jpg", "vegetable_carrot.jpg", "vegetable_cauliflower.jpg", "vegetable_chilli.jpg", "vegetable_corn.jpg", "vegetable_cucumber.jpg", "vegetable_eggplant.jpg", "vegetable_garlic.jpg", "vegetable_leek.jpg", "vegetable_lettuce.jpg", "vegetable_mushroom.jpg", "vegetable_onion.jpg", "vegetable_patato.jpg", "vegetable_peas.jpg", "vegetable_pepper.jpg", "vegetable_pickle.jpg", "vegetable_pumpkin.jpg", "vegetable_reddish.jpg", "vegetable_spinach.jpg", "vegetable_sprouts.jpg", "vegetable_sweet-potato.jpg", "vegetable_tomato.jpg", ],
};

/* ---------- Game state ---------- */
const board = document.getElementById('board');
const hdr = document.getElementById('hdr');

const startBtn = document.getElementById('startBtn');
// const timerDisplay = document.getElementById('time');
const movesEl = document.getElementById('moves');
// const bestEl = document.getElementById('best');
// const leaderboardEl = document.getElementById('leaderboardList');
// best score
// let bestScore = JSON.parse(localStorage.getItem("bestScore") || "[]");

let first = null, second = null, lock = false;

let matched = 0, totalPairs = 0;
let gameArray = [];

// set default Player Name or ask player name
let theme = localStorage.getItem('rg_theme') || 'dark';
let player1 = localStorage.getItem('player_name') || 'Human1';

// export let player1 = "Human";
// player1 = prompt("Enter Player Name (default Human?") || player1;

/* ---------- Tiles count per level ---------- */
function tilesForLevel(lvl) {
    return (lvl === 'veryeasy') ? 16 : (lvl === 'easy') ? 36 : (lvl === 'medium') ? 64 : (lvl === 'hard') ? 100 : 144;
}

/* ---------- Choose best rows/cols to match screen aspect ---------- */
// export function bestGrid(total) {
function bestGrid(total) {
    const W = window.innerWidth, H = window.innerHeight - hdr.offsetHeight - 8; // exact header height
    const target = Math.max(0.3, Math.min(3, W / H)); // sane clamp
    const portrait = H > W;
    const pairs = [];
    for (let r = 1; r <= total; r++) {
        if (total % r === 0) { const c = total / r; pairs.push([r, c]); }
    }
    let best = [Math.sqrt(total), Math.sqrt(total)], bestScore = Infinity;
    for (const [r, c] of pairs) {
        const ratio = c / r;
        let score = Math.abs(ratio - target);
        // bias: portrait → fewer cols; landscape → fewer rows
        if (portrait) score += (c / (r + c)) * 0.12; else score += (r / (r + c)) * 0.12;
        if (score < bestScore) {
            bestScore = score;
            best = [r, c];
        }
    }
    return { rows: best[0], cols: best[1] };
}

/* ---------- Fit card size so grid stays inside viewport (no scroll!) ---------- */
function applyLayout(rows, cols) {
    const gap = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--gap')) || 10;
    const availW = window.innerWidth - 16;
    const availH = window.innerHeight - hdr.offsetHeight - 16;

    const sizeX = (availW - gap * (cols - 1)) / cols;
    const sizeY = (availH - gap * (rows - 1)) / rows;
    const card = Math.max(26, Math.min(140, Math.floor(Math.min(sizeX, sizeY))));
    document.documentElement.style.setProperty('--card-size', card + 'px');

    board.style.gridTemplateColumns = `repeat(${cols}, var(--card-size))`;
    board.style.gridTemplateRows = `repeat(${rows}, var(--card-size))`;
}

/* ---------- Start / Reset ---------- */
startBtn.addEventListener('click', () => {
    if (document.getElementById("startBtn").textContent === "Start") {
        document.getElementById("startBtn").textContent = "End";
        textToSpeechEng('Start');
        startGame();
    } else {
        document.getElementById("startBtn").textContent = "Start"
        textToSpeechEng('End');
        playSound('loose');
        clearInterval(timerInterval);
        console.log(document.querySelectorAll('.card'))
        document.querySelectorAll('.card').forEach(card => {
            card.classList.add('flipped');
        });
    }
});

//level change
levelSel.addEventListener('change', () => {
    board.innerHTML = '';
    document.getElementById("startBtn").textContent = "Start";
    textToSpeechEng('level' + levelSel.value);
});

// theme change
themeSel.addEventListener('change', () => {
    board.innerHTML = '';
    document.getElementById("startBtn").textContent = "Start";
    textToSpeechEng('theme' + themeSel.value);
});

// resize window
window.addEventListener('resize', () => {
    if (totalTiles > 0) {
        const { rows, cols } = bestGrid(totalTiles);
        applyLayout(rows, cols);
    }
});

// select random items from Array to generate UNIQUE game array (as per game level) (no duplicate in easy levels)
function generateUniqueArray(c, chooseArray) {
    var gameUniqueArray = [];

    while (gameUniqueArray.length < c) {
        var randomIndex = Math.floor(Math.random() * chooseArray.length);
        var randomEmoji = chooseArray[randomIndex];
        if (!gameUniqueArray.includes(randomEmoji)) {
            gameUniqueArray.push(randomEmoji);
        }
    }
    return gameUniqueArray;
}

// select random items from Array to generate game array (as per game level) (it may be duplicate in all levels)
function generateChooseImageArray(c, preArray) {
    gameArray = [];
    for (let i = 0; i < c; i++) {
        const randomIndex = Math.floor(Math.random() * preArray.length);
        gameArray.push(preArray[randomIndex]);
    }
    return gameArray;
}

//play game
function startGame() {
    // reset confetti & winbar
    wintxt.innerHTML = '';
    // namebar.classList.remove('show');
    // stopConfetti();
    // winbar.classList.remove('show');

    totalTiles = tilesForLevel(levelSel.value);
    totalPairs = totalTiles / 2;
    matched = 0; moves = 0;
    movesEl.textContent = '0';
    // timerDisplay.textContent = '00:00:00';
    timer = true;
    clearInterval(timerInterval);
    startTimer();

    // responsive grid
    const { rows, cols } = bestGrid(totalTiles);
    applyLayout(rows, cols);

    // build deck
    let uniques = [];
    if (themes[themeSel.value].length > totalPairs) {
        uniques = generateUniqueArray(totalPairs, themes[themeSel.value]);
    } else {
        // choose random images from array
        uniques = generateChooseImageArray(totalPairs, themes[themeSel.value]);
    }

    //shuffle and duplicating deck for pair match 
    const deck = shuffle([...uniques, ...uniques]);
    board.innerHTML = '';
    first = second = null; lock = false;

    // build game layout
    deck.forEach(img => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
                <div class="inner">
                    <div class="face front" aria-label="face down"></div>

                <div class="face back" style="background-image: url('../../assets/images/${themeSel.value}/${img}')"></div>

                </div>
                    `;
        card.addEventListener('click', () => onFlip(card, img));
        board.appendChild(card);
    });
    // loadBest();
}

// array a received and return after reshuffle deck
function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    } return a;
}

/* ---------- Flip / Match ---------- */
function onFlip(card, value) {
    playSound('flip');
    if (lock) return;
    if (card.classList.contains('flipped')) return;
    card.classList.add('flipped');

    if (!first) {
        first = { card, value };
        return;
    }
    second = { card, value };
    lock = true;
    moves++;
    movesEl.textContent = String(moves);

    const isMatch = first.value === second.value;
    // card matched
    if (isMatch) {
        playSound('match');
        first.card.classList.add('matched');
        second.card.classList.add('matched');
        matched++;
        resetPick();
        if (matched === totalPairs) onWin();
    } else {
        // card mismatch
        playSound('mismatch');
        setTimeout(() => {
            first.card.classList.remove('flipped');
            second.card.classList.remove('flipped');
            playSound('flip');
            resetPick();
        }, 650);
    }
}

// reset card back 
function resetPick() {
    first = null;
    second = null;
    lock = false;
}

const wintxt = document.getElementById('winText');
wintxt.style.display = 'none';

/* ---------- Win ---------- */
function onWin() {
    clearInterval(timerInterval);
    document.getElementById("startBtn").textContent = "Start";
    // updateleaderboard()
    updateleaderboard();
    timer = false;
    // saveBest();
    // loadBest();
    wintxt.style.display = 'block';
    wintxt.innerHTML = `🎉${player1} Won!🎉(⏱️${hours}:${minutes}:${seconds}, Moves:${moves})`;
    // wintxt.textContent = `(⏱️${hrs}:${min}:${sec}`;
    // winbar.classList.add('show');
    // singleColorRow.style.display = colorModeSel.value === 'single' ? 'flex' : 'none';
    // launchConfetti();
    // saveToLeaderboard(moves, hrs, min, sec);
}

// get player name
// const namebar = document.getElementById('namebar');
// namebar.classList.add('show');
// document.getElementById('name').addEventListener('click', () => {
//     player1 = document.getElementById("nameInput").value;
//     namebar.classList.remove('show');
// });

function updateleaderboard() {
    let player_name = player1;
    // let score = 0;
    let player_opponent = "-";
    let game_id = 'memory';
    let gsize = totalTiles;
    let elapsed = hours * 3600 + minutes * 60 + seconds;
    // gameCount = moves;
    let difficulty = levelSel.value;
    // let moves = 0;
    let filed1 = 0;
    let filed2 = 0;
    let filed3 = "-";
    let filed4 = "-";
    let email = localStorage.getItem('email') || '-';
    const created_at = new Date();
    let score = totalTiles * 100 - moves * 10;
    if(difficulty == 'expert') { score = score + 500} 
    else if(difficulty == 'hard') { score = score + 400} 
    else if(difficulty == 'medium') { score = score + 300 }
    else if(difficulty == 'easy') { score = score + 200 }
    else if(difficulty == 'veryeasy') { score = score + 100 }
  
    saveToLeaderboard(player_name, player_opponent, email, gsize, difficulty, game_id, score, elapsed, moves, filed1, filed2, filed3, filed4, created_at)

    // const entry = { player_name, player_opponent, email, gsize, difficulty, game_id, score, elapsed, moves, filed1, filed2, filed3, filed4, created_at };
    // const boardData = JSON.parse(localStorage.getItem("leaderboard") || "[]");
    // boardData.push(entry);
    // localStorage.setItem("leaderboard", JSON.stringify(boardData));
  
    window.submitScore &&
      window.submitScore(player_name, player_opponent, email, gsize, difficulty, game_id, score, elapsed, moves, filed1, filed2, filed3, filed4, created_at);
  }
  document.addEventListener('DOMContentLoaded', () => {
    localrenderLeaderboard();
});
  });
