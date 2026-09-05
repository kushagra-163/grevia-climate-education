import bcrypt from 'bcryptjs';
import { User } from '../../backend/api/src/models/User';
import { UserProfile } from '../../backend/api/src/models/UserProfile';
import { Lesson } from '../../backend/api/src/models/Lesson';
import { QuestionModel, SkillProfile, QuizAttempt } from '../../backend/api/src/models/Quiz';
import { Badge, Mission } from '../../backend/api/src/models/Gamification';
import { ClimateSnapshot } from '../../backend/api/src/models/ClimateSnapshot';
import { connectDB, disconnectDB } from '../../backend/api/src/config/db';

export const seedDatabase = async () => {
  console.log('[Seed] Seeding Grevia database...');

  // 1. Seed Users (Admin, Teacher, Student)
  const passHash = await bcrypt.hash('GreviaPass123!', 10);

  const admin = await User.findOneAndUpdate(
    { email: 'admin@grevia.edu' },
    {
      name: 'System Admin',
      email: 'admin@grevia.edu',
      passwordHash: passHash,
      role: 'admin',
      city: 'Berlin',
      country: 'Germany',
      points: 1500,
    },
    { upsert: true, new: true }
  );
  await UserProfile.findOneAndUpdate({ userId: admin._id }, { userId: admin._id }, { upsert: true });

  const teacher = await User.findOneAndUpdate(
    { email: 'teacher@grevia.edu' },
    {
      name: 'Elena Rostova',
      email: 'teacher@grevia.edu',
      passwordHash: passHash,
      role: 'teacher',
      classId: 'class-10a',
      schoolId: 'eco-academy',
      city: 'Tokyo',
      country: 'Japan',
      points: 950,
    },
    { upsert: true, new: true }
  );
  await UserProfile.findOneAndUpdate({ userId: teacher._id }, { userId: teacher._id }, { upsert: true });

  const student = await User.findOneAndUpdate(
    { email: 'student@grevia.edu' },
    {
      name: 'Kushagra Vispute',
      email: 'student@grevia.edu',
      passwordHash: passHash,
      role: 'student',
      classId: 'class-10a',
      schoolId: 'eco-academy',
      city: 'Nashik',
      country: 'India',
      points: 420,
    },
    { upsert: true, new: true }
  );
  await UserProfile.findOneAndUpdate({ userId: student._id }, { userId: student._id }, { upsert: true });

  console.log('[Seed] Demo accounts verified:');
  console.log('  - Admin:   admin@grevia.edu / GreviaPass123!');
  console.log('  - Teacher: teacher@grevia.edu / GreviaPass123!');
  console.log('  - Student: student@grevia.edu (Nashik, India) / GreviaPass123!');

  // 2. Seed Climate Snapshots
  await ClimateSnapshot.findOneAndUpdate(
    { 'location.city': 'Nashik' },
    {
      location: { city: 'Nashik', country: 'India', lat: 19.9975, lon: 73.7898 },
      source: 'NASA_POWER_MOCK',
      temperatureC: 28.2,
      precipitationMm: 0.5,
      humidityPct: 65,
      solarRadiation: 5.2,
      co2ppm: 421.5,
      aqi: 42,
      naturalEvents: [
        { id: 'EONET-IN-1', title: 'South Asian Seasonal Atmospheric Advisory', category: 'Atmosphere', date: new Date() },
      ],
      recordedAt: new Date(),
    },
    { upsert: true }
  );

  // 3. Seed Badges
  const badgesData = [
    {
      code: 'green_starter',
      title: 'Green Starter',
      description: 'Logged your very first sustainable eco-action.',
      icon: '🌱',
      category: 'action',
      requirementType: 'first_action',
      requirementValue: 1,
    },
    {
      code: 'climate_learner',
      title: 'Climate Learner',
      description: 'Completed at least 5 interactive lessons.',
      icon: '📚',
      category: 'learning',
      requirementType: 'lessons_count',
      requirementValue: 5,
    },
    {
      code: 'quiz_explorer',
      title: 'Quiz Explorer',
      description: 'Completed 5 adaptive quizzes with great performance.',
      icon: '⚡',
      category: 'quiz',
      requirementType: 'quizzes_count',
      requirementValue: 5,
    },
    {
      code: 'climate_master',
      title: 'Climate Master',
      description: 'Achieved over 500 verified points in your ledger.',
      icon: '👑',
      category: 'quiz',
      requirementType: 'high_score',
      requirementValue: 500,
    },
    {
      code: 'eco_champion',
      title: 'Eco Champion',
      description: 'Completed multiple community missions.',
      icon: '🏆',
      category: 'mission',
      requirementType: 'missions_count',
      requirementValue: 2,
    },
  ];

  for (const b of badgesData) {
    await Badge.findOneAndUpdate({ code: b.code }, b, { upsert: true });
  }

  // 4. Seed Missions
  const missionsData = [
    {
      title: 'Plastic-Free Week Challenge',
      description: 'Avoid single-use plastics for 7 consecutive days. Log reusable water bottle usage or zero-waste shopping.',
      type: 'community',
      target: 7,
      targetUnit: 'days',
      rewardPoints: 200,
      startDate: new Date(),
      endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      isActive: true,
    },
    {
      title: 'Public Transport Commute Sprint',
      description: 'Take buses, subways, or bicycles for 5 school or work trips.',
      type: 'solo',
      target: 5,
      targetUnit: 'trips',
      rewardPoints: 150,
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      isActive: true,
    },
    {
      title: 'Energy Saver Challenge',
      description: 'Unplug standby electronics and reduce household power draw.',
      type: 'solo',
      target: 3,
      targetUnit: 'actions',
      rewardPoints: 100,
      startDate: new Date(),
      endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      isActive: true,
    },
  ];

  for (const m of missionsData) {
    await Mission.findOneAndUpdate({ title: m.title }, m, { upsert: true });
  }

  // 5. Seed Climate Lessons
  const lessonsData = [
    {
      title: 'Introduction to Greenhouse Gases',
      topic: 'climate_science',
      level: 'beginner',
      summary: 'Learn how carbon dioxide, methane, and nitrous oxide trap thermal radiation.',
      content: 'Greenhouse gases occur naturally in the atmosphere, but human activities such as burning fossil fuels and deforestation have elevated concentration levels to historic highs.',
      estimatedMinutes: 8,
    },
    {
      title: 'Renewable Energy Fundamentals',
      topic: 'renewable_energy',
      level: 'beginner',
      summary: 'Explore solar photovoltaics, wind turbines, and hydroelectric power systems.',
      content: 'Renewable energy sources replenish naturally without emitting direct greenhouse gases during power generation.',
      estimatedMinutes: 10,
    },
    {
      title: 'Energy Efficiency in Buildings',
      topic: 'energy',
      level: 'intermediate',
      summary: 'Discover heat pumps, insulation, and smart grid demand response.',
      content: 'Buildings account for nearly 40% of global energy consumption. Upgrading insulation and HVAC controls provides immediate efficiency gains.',
      estimatedMinutes: 12,
    },
    {
      title: 'Circular Waste Management',
      topic: 'waste',
      level: 'beginner',
      summary: 'Understand composting, material recovery, and reduced packaging.',
      content: 'The circular economy aims to eliminate waste by redesigning product lifecycles for reuse and repair.',
      estimatedMinutes: 10,
    },
    {
      title: 'Global Hydrological Cycle & Climate Change',
      topic: 'water',
      level: 'intermediate',
      summary: 'Examine how rising temperatures alter precipitation patterns and water availability.',
      content: 'Warming global temperatures intensify evapotranspiration, leading to more severe droughts and intense flooding rainfall events.',
      estimatedMinutes: 11,
    },
    {
      title: 'Biodiversity Protection & Ecosystem Services',
      topic: 'biodiversity',
      level: 'beginner',
      summary: 'Discover how intact forests and wetlands sustain climate resilience.',
      content: 'Healthy ecosystems act as carbon sinks and provide natural barriers against climate impacts.',
      estimatedMinutes: 9,
    },
  ];

  for (const l of lessonsData) {
    await Lesson.findOneAndUpdate({ title: l.title }, l, { upsert: true });
  }

  // 6. Comprehensive 120+ Question Bank Definition across 8 topics x 3 levels x 5 unique questions
  const rawQuestionsData = [
    // CLIMATE SCIENCE - Beginner
    {
      question: 'Which gas is responsible for the largest share of human-driven global warming?',
      topic: 'climate_science', level: 'beginner',
      options: ['Carbon Dioxide (CO₂)', 'Methane (CH₄)', 'Nitrous Oxide (N₂O)', 'Water Vapor'],
      correctAnswer: 'A',
      explanation: 'Carbon dioxide accounts for over 75% of global anthropogenic greenhouse gas emissions.',
    },
    {
      question: 'What is the natural process where atmospheric gases trap solar heat called?',
      topic: 'climate_science', level: 'beginner',
      options: ['Ozone depletion', 'The Greenhouse Effect', 'Photosynthesis', 'Thermal expansion'],
      correctAnswer: 'B',
      explanation: 'The greenhouse effect traps infrared heat in Earth’s lower atmosphere, regulating global surface climate.',
    },
    {
      question: 'What human activity releases the highest amount of carbon dioxide into the atmosphere?',
      topic: 'climate_science', level: 'beginner',
      options: ['Burning fossil fuels for energy', 'Plastic recycling', 'Solar power installation', 'Organic farming'],
      correctAnswer: 'A',
      explanation: 'Combustion of coal, oil, and gas for electricity and heat is the single largest source of atmospheric CO2.',
    },
    {
      question: 'What is the primary indicator of global climate change monitored by ocean satellites?',
      topic: 'climate_science', level: 'beginner',
      options: ['Sea surface temperature and global sea level rise', 'Tidal frequency', 'Submarine sound velocity', 'Salt crystallization rates'],
      correctAnswer: 'A',
      explanation: 'Global sea level rise and ocean surface temperature increases are direct physical indicators of planetary warming.',
    },
    {
      question: 'How do forests help mitigate climate change?',
      topic: 'climate_science', level: 'beginner',
      options: ['By absorbing carbon dioxide through photosynthesis', 'By releasing methane into soil', 'By reflecting sunlight back into space', 'By cooling deep magma layers'],
      correctAnswer: 'A',
      explanation: 'Trees act as natural carbon sinks, capturing atmospheric CO2 and storing it as biomass.',
    },

    // CLIMATE SCIENCE - Intermediate
    {
      question: 'How does the Global Warming Potential (GWP) of Methane (CH4) compare to CO2 over a 20-year horizon?',
      topic: 'climate_science', level: 'intermediate',
      options: ['Methane is about 84 times more potent than CO2', 'Methane is 5 times weaker than CO2', 'Methane has equal potency to CO2', 'Methane neutralizes CO2'],
      correctAnswer: 'A',
      explanation: 'Over a 20-year timeframe, methane traps over 80 times more heat per mass unit than carbon dioxide.',
    },
    {
      question: 'What phenomenon causes dark ocean water to absorb more heat as white sea ice melts?',
      topic: 'climate_science', level: 'intermediate',
      options: ['The Ice-Albedo Feedback Loop', 'Thermohaline slowdown', 'Coral calcification', 'Aerosol masking'],
      correctAnswer: 'A',
      explanation: 'The ice-albedo feedback occurs when melting sea ice replaces reflective surfaces with heat-absorbing dark water.',
    },
    {
      question: 'What is the primary cause of ocean acidification?',
      topic: 'climate_science', level: 'intermediate',
      options: ['Seawater absorbing excess atmospheric CO2 to form carbonic acid', 'Industrial chemical spills', 'Plastic waste breakdown', 'Rising ocean temperatures'],
      correctAnswer: 'A',
      explanation: 'Dissolved atmospheric CO2 reacts with ocean water to produce carbonic acid, lowering marine pH.',
    },
    {
      question: 'What cyclical astronomical variations influence long-term Earth glacial periods?',
      topic: 'climate_science', level: 'intermediate',
      options: ['Milankovitch Cycles', 'Kepler orbits', 'Solar flare oscillations', 'Lunar precession tides'],
      correctAnswer: 'A',
      explanation: 'Milankovitch cycles involve changes in Earth’s orbital eccentricity, axial tilt, and precession over tens of thousands of years.',
    },
    {
      question: 'How do atmospheric sulfate aerosols influence surface temperatures in the short term?',
      topic: 'climate_science', level: 'intermediate',
      options: ['They reflect incoming sunlight, causing a net cooling effect', 'They absorb infrared heat and warm the crust', 'They destroy atmospheric CO2', 'They accelerate ocean evaporation'],
      correctAnswer: 'A',
      explanation: 'Sulfate aerosols scatter solar radiation back into space, temporarily offsetting greenhouse gas warming.',
    },

    // CLIMATE SCIENCE - Advanced
    {
      question: 'What unit measures planetary radiative forcing shifts caused by greenhouse gas emissions?',
      topic: 'climate_science', level: 'advanced',
      options: ['Watts per square meter (W/m²)', 'Joules per kilogram', 'Pascals per degree Celsius', 'Lumens per hectare'],
      correctAnswer: 'A',
      explanation: 'Radiative forcing expresses the net energy change at the top of the atmosphere in W/m² relative to pre-industrial baselines.',
    },
    {
      question: 'What climate feedback mechanism threatens massive methane release from arctic tundra?',
      topic: 'climate_science', level: 'advanced',
      options: ['Permafrost thawing feedback', 'Stratospheric ozone collapse', 'Oceanic upwelling inversion', 'Mantle convective release'],
      correctAnswer: 'A',
      explanation: 'Thawing permafrost exposes organic material to microbial decomposition, releasing vast reserves of CH4 and CO2.',
    },
    {
      question: 'What ocean circulation system transports warm equatorial water toward the North Atlantic?',
      topic: 'climate_science', level: 'advanced',
      options: ['The Atlantic Meridional Overturning Circulation (AMOC)', 'The Humboldt Current', 'The Kuroshio Extension', 'The Antarctic Circumpolar Current'],
      correctAnswer: 'A',
      explanation: 'AMOC is a key thermohaline ocean conveyor system regulating North Hemisphere climate stability.',
    },
    {
      question: 'In IPCC emissions modeling, what does an Shared Socioeconomic Pathway (SSP) scenario define?',
      topic: 'climate_science', level: 'advanced',
      options: ['Integrated socio-economic narratives combining mitigation, adaptation, and demographic trends', 'Short-term weather forecasting vectors', 'Solar panel manufacturing quotas', 'Nuclear waste containment protocols'],
      correctAnswer: 'A',
      explanation: 'SSPs outline distinct global development pathways used to project future climate change and mitigation challenges.',
    },
    {
      question: 'What is the equilibrium climate sensitivity (ECS) estimate range for doubling atmospheric CO2?',
      topic: 'climate_science', level: 'advanced',
      options: ['Approximately 2.5°C to 4.0°C', '0.1°C to 0.5°C', '10.0°C to 15.0°C', '-2.0°C to 0.0°C'],
      correctAnswer: 'A',
      explanation: 'IPCC AR6 assesses the likely ECS range between 2.5°C and 4.0°C warming per doubled CO2 concentration.',
    },

    // ENERGY & TRANSITION - Beginner
    {
      question: 'What is phantom energy load in residential homes?',
      topic: 'energy', level: 'beginner',
      options: ['Power consumed by electronics while turned off or in standby mode', 'Electricity generated by rooftop wind chimes', 'Static electricity from carpet friction', 'Energy lost in high-voltage lines'],
      correctAnswer: 'A',
      explanation: 'Standby or phantom loads draw electricity continuously when appliances remain plugged into wall outlets.',
    },
    {
      question: 'Which lighting technology is the most energy efficient for homes?',
      topic: 'energy', level: 'beginner',
      options: ['Light Emitting Diode (LED)', 'Incandescent bulbs', 'Halogen spotlights', 'Kerosene lamps'],
      correctAnswer: 'A',
      explanation: 'LEDs consume up to 80% less energy and last significantly longer than traditional incandescent light bulbs.',
    },
    {
      question: 'What device measures household electrical energy usage in real-time?',
      topic: 'energy', level: 'beginner',
      options: ['Smart Electric Meter', 'Galvanic barometer', 'Thermal multimeter', 'Seismograph'],
      correctAnswer: 'A',
      explanation: 'Smart meters track hourly electricity consumption, enabling demand-side energy conservation.',
    },
    {
      question: 'Why is building wall insulation important for climate conservation?',
      topic: 'energy', level: 'beginner',
      options: ['It reduces the heating and cooling energy required to maintain indoor temperature', 'It generates clean solar energy', 'It purifies indoor air', 'It cools surrounding outdoor air'],
      correctAnswer: 'A',
      explanation: 'Proper insulation reduces thermal leaks, decreasing HVAC fuel and electricity requirements.',
    },
    {
      question: 'What is energy conservation?',
      topic: 'energy', level: 'beginner',
      options: ['Reducing energy consumption through behavioral changes and reduced usage', 'Increasing power plant capacity', 'Importing electricity from neighboring countries', 'Converting coal directly to gas'],
      correctAnswer: 'A',
      explanation: 'Energy conservation involves modifying behaviors to avoid unnecessary energy consumption.',
    },

    // ENERGY & TRANSITION - Intermediate
    {
      question: 'What does Combined Heat and Power (CHP) accomplish in industrial plants?',
      topic: 'energy', level: 'intermediate',
      options: ['Captures waste heat from power generation for space or process heating', 'Combines coal and natural gas in one furnace', 'Uses solar heat to split water molecules', 'Stores heat in lithium batteries'],
      correctAnswer: 'A',
      explanation: 'CHP or cogeneration recovers thermal energy usually wasted during electricity generation, achieving up to 80% efficiency.',
    },
    {
      question: 'What is baseload power in electrical grid operations?',
      topic: 'energy', level: 'intermediate',
      options: ['The minimum continuous level of demand on an electrical grid', 'The maximum peak power during hot summer afternoons', 'Electricity generated exclusively by rooftop solar', 'Emergency backup generator capacity'],
      correctAnswer: 'A',
      explanation: 'Baseload demand is the baseline level of power required 24/7 across the power grid.',
    },
    {
      question: 'What measure expresses the energy delivered by a fuel source relative to the energy spent extracting it?',
      topic: 'energy', level: 'intermediate',
      options: ['Energy Return on Investment (EROI)', 'Thermal enthalpy index', 'Carnot cycle quotient', 'Volt-ampere reactance'],
      correctAnswer: 'A',
      explanation: 'EROI measures net energy yield by dividing output energy by input energy invested during extraction.',
    },
    {
      question: 'How do electric heat pumps achieve over 300% efficiency in heating homes?',
      topic: 'energy', level: 'intermediate',
      options: ['They transfer existing outdoor heat indoors rather than creating heat through combustion', 'They generate electricity internally', 'They burn hydrogen gas silently', 'They compress sunlight directly'],
      correctAnswer: 'A',
      explanation: 'Heat pumps act as reverse refrigerators, using electricity to move thermal energy from outside to inside.',
    },
    {
      question: 'What is the goal of demand response programs in power grids?',
      topic: 'energy', level: 'intermediate',
      options: ['Encouraging consumers to shift energy usage away from peak demand hours', 'Automatically shutting off power to residential areas', 'Increasing fossil fuel subsidies', 'Mandating constant industrial operation'],
      correctAnswer: 'A',
      explanation: 'Demand response incentivizes consumers to reduce or shift electricity use during high peak demand times.',
    },

    // ENERGY & TRANSITION - Advanced
    {
      question: 'What transmission technology is preferred for carrying massive electricity over long distances with minimal loss?',
      topic: 'energy', level: 'advanced',
      options: ['High-Voltage Direct Current (HVDC)', 'Single-phase Alternating Current', 'Superconducting fluid pipes', 'Low-voltage distribution lines'],
      correctAnswer: 'A',
      explanation: 'HVDC transmits large electrical capacity over thousands of miles with significantly lower line loss than AC systems.',
    },
    {
      question: 'In smart grid economics, what is a capacity market mechanism?',
      topic: 'energy', level: 'advanced',
      options: ['Payments made to power generators to ensure standby availability for peak grid reliability', 'Spot trading of solar panels', 'Taxes on battery storage', 'Export tariffs on crude oil'],
      correctAnswer: 'A',
      explanation: 'Capacity markets compensate generators for maintaining supply reserves necessary to prevent blackouts.',
    },
    {
      question: 'What thermal insulation metric measures a material resistance to conductive heat transfer?',
      topic: 'energy', level: 'advanced',
      options: ['R-value', 'Joule coefficient', 'Ampere rating', 'Kelvin modulus'],
      correctAnswer: 'A',
      explanation: 'R-value measures thermal resistance; higher R-values signify greater insulation effectiveness.',
    },
    {
      question: 'What grid challenge occurs when high solar generation exceeds midday demand, causing steep evening ramps?',
      topic: 'energy', level: 'advanced',
      options: ['The Duck Curve phenomenon', 'The Rankine cycle deficit', 'Ferroresonance overload', 'The Peltier thermal cliff'],
      correctAnswer: 'A',
      explanation: 'The Duck Curve illustrates grid net load drop during midday solar production followed by rapid evening demand spikes.',
    },
    {
      question: 'What is industrial heat decarbonization primarily focused on?',
      topic: 'energy', level: 'advanced',
      options: ['Replacing high-temperature fossil combustion in steel and cement with green electricity and hydrogen', 'Installing office ceiling fans', 'Switching to diesel boilers', 'Insulating residential attics'],
      correctAnswer: 'A',
      explanation: 'Decarbonizing high-temperature industrial heat requires electrification, hydrogen, or biomass replacing direct fossil combustion.',
    },

    // RENEWABLE ENERGY - Beginner
    {
      question: 'What natural resource powers photovoltaic solar cells?',
      topic: 'renewable_energy', level: 'beginner',
      options: ['Sunlight (photons)', 'Geothermal steam', 'Wind currents', 'Tidal gravity'],
      correctAnswer: 'A',
      explanation: 'Photovoltaic cells convert photons from sunlight directly into electrical voltage via the photoelectric effect.',
    },
    {
      question: 'What kinetic energy source turns giant blades to generate wind power?',
      topic: 'renewable_energy', level: 'beginner',
      options: ['Atmospheric wind currents', 'Ocean wave swells', 'River currents', 'Volcanic steam'],
      correctAnswer: 'A',
      explanation: 'Wind turbines harness atmospheric air movement to spin generators, producing zero-emission electricity.',
    },
    {
      question: 'Which renewable energy source harnesses heat trapped deep within the Earth crust?',
      topic: 'renewable_energy', level: 'beginner',
      options: ['Geothermal Energy', 'Hydroelectric power', 'Solar thermal', 'Bioethanol'],
      correctAnswer: 'A',
      explanation: 'Geothermal plants extract underground steam or hot water to spin turbines and heat buildings.',
    },
    {
      question: 'How do hydroelectric dams generate clean power?',
      topic: 'renewable_energy', level: 'beginner',
      options: ['By channeling falling water through hydraulic turbines', 'By boiling river water with coal', 'By splitting water molecules into hydrogen', 'By evaporating reservoir water'],
      correctAnswer: 'A',
      explanation: 'Hydroelectric facilities use the gravitational force of falling water to drive electric generators.',
    },
    {
      question: 'What is biomass energy derived from?',
      topic: 'renewable_energy', level: 'beginner',
      options: ['Organic plant and agricultural materials', 'Crude oil refining', 'Uranium isotopes', 'Synthetic plastics'],
      correctAnswer: 'A',
      explanation: 'Biomass incorporates organic matter such as wood pellets, crop residues, and municipal bio-waste.',
    },

    // RENEWABLE ENERGY - Intermediate
    {
      question: 'What is the theoretical maximum efficiency limit for a single-junction silicon photovoltaic cell?',
      topic: 'renewable_energy', level: 'intermediate',
      options: ['The Shockley-Queisser Limit (~33.7%)', 'Betz Limit (59.3%)', 'Carnot Limit (100%)', 'Hubbert Limit (50%)'],
      correctAnswer: 'A',
      explanation: 'The Shockley-Queisser limit defines the maximum physical solar energy conversion efficiency for a single p-n junction cell.',
    },
    {
      question: 'What physical law limits the maximum kinetic energy a wind turbine can extract from wind?',
      topic: 'renewable_energy', level: 'intermediate',
      options: ['Betz Law (59.3% maximum efficiency)', 'Ohm Law', 'First Law of Thermodynamics', 'Kepler Law'],
      correctAnswer: 'A',
      explanation: 'Betz Law dictates that no turbine can capture more than 59.3% of the kinetic energy in wind.',
    },
    {
      question: 'What type of utility-scale energy storage uses elevated water reservoirs to store off-peak power?',
      topic: 'renewable_energy', level: 'intermediate',
      options: ['Pumped-Storage Hydroelectricity (PSH)', 'Compressed Air Storage', 'Flywheel kinetic storage', 'Lithium ion arrays'],
      correctAnswer: 'A',
      explanation: 'Pumped storage hydro pumps water to an upper reservoir during low demand and releases it through turbines during peak hours.',
    },
    {
      question: 'What is the capacity factor of a power plant?',
      topic: 'renewable_energy', level: 'intermediate',
      options: ['The ratio of actual electricity generated over a period to its maximum potential output at full capacity', 'The physical size of the power generator', 'The total financial cost per megawatt', 'The number of operational staff employed'],
      correctAnswer: 'A',
      explanation: 'Capacity factor measures real-world output over time relative to maximum nameplate generator rating.',
    },
    {
      question: 'How do Concentrated Solar Power (CSP) plants differ from photovoltaic solar systems?',
      topic: 'renewable_energy', level: 'intermediate',
      options: ['CSP uses mirrors to focus sunlight to heat a working fluid, driving a steam turbine', 'CSP converts light directly to DC current', 'CSP works only under heavy cloud cover', 'CSP uses wind currents to cool panels'],
      correctAnswer: 'A',
      explanation: 'CSP concentrates solar radiation using mirrors to heat thermal fluids, enabling integrated thermal energy storage.',
    },

    // RENEWABLE ENERGY - Advanced
    {
      question: 'What chemical electrolysis technology uses a solid polymer electrolyte to produce green hydrogen from water?',
      topic: 'renewable_energy', level: 'advanced',
      options: ['Proton Exchange Membrane (PEM) Electrolysis', 'Alkaline Liquid Siphon', 'Steam Methane Reforming', 'Fischer-Tropsch Synthesis'],
      correctAnswer: 'A',
      explanation: 'PEM electrolyzers split pure water into oxygen and green hydrogen using renewable DC electricity.',
    },
    {
      question: 'What emerging tandem solar cell technology pairs silicon with crystal layers to surpass 30% efficiency?',
      topic: 'renewable_energy', level: 'advanced',
      options: ['Perovskite-Silicon Tandem Cells', 'Gallium Arsenide Monoliths', 'Cadmium Telluride Thin-Films', 'Copper Indium Selenium Panels'],
      correctAnswer: 'A',
      explanation: 'Perovskite tandem cells stack complementary bandgap materials to capture broader solar spectrum frequencies.',
    },
    {
      question: 'In offshore wind engineering, what foundation design enables deployment in ocean depths over 60 meters?',
      topic: 'renewable_energy', level: 'advanced',
      options: ['Floating Submersible Foundations (Tension Leg / Semi-submersible)', 'Monopile steel cylinders', 'Concrete gravity bases', 'Direct seabed anchoring pins'],
      correctAnswer: 'A',
      explanation: 'Floating offshore wind structures utilize tethered buoyant platforms to harvest strong deep-water marine winds.',
    },
    {
      question: 'What grid phenomenon occurs when renewable generation must be deliberately curtailed due to transmission bottlenecking?',
      topic: 'renewable_energy', level: 'advanced',
      options: ['Renewable Curtailment', 'Voltage collapse', 'Frequency runaway', 'Reactive impedance boost'],
      correctAnswer: 'A',
      explanation: 'Curtailment happens when grid operators command clean energy generators to reduce output due to transmission overload.',
    },
    {
      question: 'Which battery cathode chemistry offers longer cycle life and higher thermal stability for grid energy storage without cobalt?',
      topic: 'renewable_energy', level: 'advanced',
      options: ['Lithium Iron Phosphate (LFP)', 'Lithium Cobalt Oxide (LCO)', 'Nickel Manganese Cobalt (NMC)', 'Lead Acid Gel'],
      correctAnswer: 'A',
      explanation: 'LFP chemistries provide exceptional thermal safety, long cycle life, and eliminate cobalt dependency for stationary storage.',
    },

    // WASTE & CIRCULAR ECONOMY - Beginner
    {
      question: 'What is the correct order of the classic waste management hierarchy?',
      topic: 'waste', level: 'beginner',
      options: ['Reduce, Reuse, Recycle', 'Recycle, Burn, Discard', 'Reuse, Incinerate, Bury', 'Dump, Sort, Recover'],
      correctAnswer: 'A',
      explanation: 'Preventing waste creation (Reduce) and reusing products are prioritized over processing materials (Recycle).',
    },
    {
      question: 'What happens to organic food waste when thrown into oxygen-deprived landfills?',
      topic: 'waste', level: 'beginner',
      options: ['It decomposes anaerobically, generating methane gas', 'It converts directly into soil nutrients', 'It freezes permanently', 'It turns into liquid petroleum'],
      correctAnswer: 'A',
      explanation: 'Anaerobic landfill conditions cause organic waste to produce methane, a potent climate-warming greenhouse gas.',
    },
    {
      question: 'What environmental harm is caused by single-use plastic packaging?',
      topic: 'waste', level: 'beginner',
      options: ['It persists for centuries, breaking down into toxic microplastics that harm wildlife', 'It dissolves instantly in rainwater', 'It absorbs atmospheric carbon dioxide', 'It accelerates plant growth'],
      correctAnswer: 'A',
      explanation: 'Synthetic plastics resist natural biodegradation, polluting ecosystems and fragmenting into harmful microparticles.',
    },
    {
      question: 'What natural process converts kitchen vegetable scraps into nutrient-rich soil fertilizer?',
      topic: 'waste', level: 'beginner',
      options: ['Composting', 'Incineration', 'Pyrolysis', 'Vitrification'],
      correctAnswer: 'A',
      explanation: 'Composting relies on aerobic micro-organisms to break down organic wastes into humus fertilizer.',
    },
    {
      question: 'Why are plastic shopping bags particularly harmful to marine animals?',
      topic: 'waste', level: 'beginner',
      options: ['Animals mistake floating bags for jellyfish or food, causing internal blockages', 'Bags dissolve into sea salt', 'Bags warm the ocean water', 'Bags increase ocean oxygen levels'],
      correctAnswer: 'A',
      explanation: 'Sea turtles and marine life frequently ingest discarded plastic bags, causing fatal gastrointestinal tract blockages.',
    },

    // WASTE & CIRCULAR ECONOMY - Intermediate
    {
      question: 'What environmental policy principle holds manufacturers responsible for post-consumer waste management?',
      topic: 'waste', level: 'intermediate',
      options: ['Extended Producer Responsibility (EPR)', 'Pay-as-you-throw pricing', 'Landfill tax exemptions', 'Consumer duty mandate'],
      correctAnswer: 'A',
      explanation: 'EPR policies mandate that manufacturers finance product end-of-life takeback, recycling, and safe disposal.',
    },
    {
      question: 'How does chemical recycling differ from traditional mechanical recycling of plastics?',
      topic: 'waste', level: 'intermediate',
      options: ['Chemical recycling breaks polymers back down into monomer feedstocks, while mechanical recycling shreds and remelts plastic', 'Mechanical recycling uses solvent chemicals', 'Chemical recycling only works on food scraps', 'Mechanical recycling produces virgin oil'],
      correctAnswer: 'A',
      explanation: 'Chemical recycling (depolymerization) breaks plastic polymers down into chemical building blocks for virgin-grade material reuse.',
    },
    {
      question: 'What waste-to-energy process burns municipal solid waste at high temperatures to generate steam electricity?',
      topic: 'waste', level: 'intermediate',
      options: ['Waste Incineration with Energy Recovery (EfW)', 'Open pit combustion', 'Aerobic digestion', 'Hydro-cracking'],
      correctAnswer: 'A',
      explanation: 'Modern Energy-from-Waste plants burn non-recyclable rubbish under strict emission controls to drive steam turbine generators.',
    },
    {
      question: 'What is the primary challenge in recycling e-waste (electronic devices)?',
      topic: 'waste', level: 'intermediate',
      options: ['Electronics contain complex mixtures of toxic heavy metals, flame retardants, and valuable trace elements bonded together', 'Electronics melt too easily', 'Electronics contain no metals', 'Electronics biodegrade too quickly'],
      correctAnswer: 'A',
      explanation: 'Complex multi-material circuit boards require specialized dismantling and chemical processing to recover gold, copper, and rare earths safely.',
    },
    {
      question: 'What is the main limitation of PLA bioplastics made from cornstarch?',
      topic: 'waste', level: 'intermediate',
      options: ['They require high-temperature industrial composting facilities and will not break down quickly in home compost or oceans', 'They dissolve instantly in hot water', 'They emit toxic sulfur when touched', 'They cannot hold dry goods'],
      correctAnswer: 'A',
      explanation: 'PLA bioplastics require controlled industrial composting conditions (58°C+) to biodegrade effectively.',
    },

    // WASTE & CIRCULAR ECONOMY - Advanced
    {
      question: 'What circular economic framework designs products for indefinite biological or technical closed loops?',
      topic: 'waste', level: 'advanced',
      options: ['Cradle-to-Cradle (C2C) Design', 'Cradle-to-Grave manufacturing', 'Linear extraction modeling', 'Planned obsolescence protocols'],
      correctAnswer: 'A',
      explanation: 'Cradle-to-Cradle design eliminates waste by ensuring materials safely re-enter biological or industrial cycles.',
    },
    {
      question: 'What industrial strategy involves one factory using the waste or byproduct of a neighboring plant as raw material?',
      topic: 'waste', level: 'advanced',
      options: ['Industrial Symbiosis (e.g. Kalundborg Eco-Industrial Park)', 'Vertical integration', 'Linear supply chain contracting', 'Monopoly processing'],
      correctAnswer: 'A',
      explanation: 'Industrial symbiosis engages separate industries in cooperative exchanges of energy, water, and material byproducts.',
    },
    {
      question: 'What thermal decomposition process converts plastic waste into synthetic oil in oxygen-free reactors?',
      topic: 'waste', level: 'advanced',
      options: ['Pyrolysis', 'Sintering', 'Calcination', 'Flocculation'],
      correctAnswer: 'A',
      explanation: 'Pyrolysis applies intense heat without oxygen to crack long-chain plastic polymers into synthetic fuel oils and gases.',
    },
    {
      question: 'What metric evaluates the total raw material mass extracted relative to final product weight across lifecycle steps?',
      topic: 'waste', level: 'advanced',
      options: ['Material Intensity Per Service (MIPS)', 'Kuroshio index', 'Thermal expansion factor', 'Carbon payback period'],
      correctAnswer: 'A',
      explanation: 'MIPS calculates the ecological material footprint required to produce a specific good or service.',
    },
    {
      question: 'How does planned obsolescence conflict with circular economy goals?',
      topic: 'waste', level: 'advanced',
      options: ['It intentionally shortens product lifespan to force replacement sales, accelerating resource depletion and e-waste', 'It encourages modular repair', 'It eliminates manufacturing waste', 'It lowers raw material mining'],
      correctAnswer: 'A',
      explanation: 'Designing products to fail or become unrepairable undermines durability and drives wasteful resource consumption.',
    },

    // WATER CONSERVATION - Beginner
    {
      question: 'What percentage of Earth total water supply is accessible fresh water for human use?',
      topic: 'water', level: 'beginner',
      options: ['Less than 1%', 'About 25%', 'Around 50%', 'Over 70%'],
      correctAnswer: 'A',
      explanation: 'While oceans cover most of Earth, under 1% of planetary water is liquid, accessible freshwater.',
    },
    {
      question: 'What is greywater in home water recycling?',
      topic: 'water', level: 'beginner',
      options: ['Relatively clean wastewater from showers, sinks, and laundry', 'Sewage water from toilets', 'Industrial chemical runoff', 'Ocean saltwater'],
      correctAnswer: 'A',
      explanation: 'Greywater includes gently used water from household basins, washing machines, and showers suitable for garden irrigation.',
    },
    {
      question: 'Which agricultural watering technique delivers water directly to plant roots with minimal evaporation?',
      topic: 'water', level: 'beginner',
      options: ['Drip Irrigation', 'Flood irrigation', 'High-pressure spray cannons', 'Canal flooding'],
      correctAnswer: 'A',
      explanation: 'Drip irrigation channels targeted water drops straight to root zones, saving up to 50% more water than sprayers.',
    },
    {
      question: 'What fixture installation helps reduce residential bathroom water consumption significantly?',
      topic: 'water', level: 'beginner',
      options: ['Low-flow aerated showerheads and dual-flush toilets', 'High-volume garden hoses', 'Open drain traps', 'Single-flush 5-gallon tanks'],
      correctAnswer: 'A',
      explanation: 'Aerators mix air into water streams, maintaining pressure while reducing overall gallon flow.',
    },
    {
      question: 'What simple habit prevents gallons of clean tap water from being wasted every day?',
      topic: 'water', level: 'beginner',
      options: ['Turning off the tap while brushing teeth', 'Running half-full dishwashers', 'Watering lawns at noon', 'Ignoring pipe leaks'],
      correctAnswer: 'A',
      explanation: 'Turning off running taps during brushing saves up to 8 gallons of clean water daily per person.',
    },

    // WATER CONSERVATION - Intermediate
    {
      question: 'What environmental consequence occurs when underground freshwater aquifers are over-pumped faster than natural recharge?',
      topic: 'water', level: 'intermediate',
      options: ['Aquifer depletion and land subsidence (ground sinking)', 'Increased mountain snowfall', 'River flow doubling', 'Aquifer water boiling'],
      correctAnswer: 'A',
      explanation: 'Over-extracting groundwater collapses sub-surface sediment layers, causing permanent land subsidence and well dry-outs.',
    },
    {
      question: 'What concept measures the volume of freshwater consumed to produce agricultural products like beef or cotton?',
      topic: 'water', level: 'intermediate',
      options: ['Virtual Water Content (Water Footprint)', 'Hydraulic conductivity', 'Osmotic potential', 'Turbidity index'],
      correctAnswer: 'A',
      explanation: 'Virtual water accounts for direct and indirect freshwater consumed across a product’s entire supply chain.',
    },
    {
      question: 'What is the main environmental drawback of sea water Reverse Osmosis (SWRO) desalination plants?',
      topic: 'water', level: 'intermediate',
      options: ['High energy consumption and disposal of concentrated toxic brine back into ocean ecosystems', 'Freshwater produced is too salty', 'Desalination creates methane gas', 'Desalination causes earthquakes'],
      correctAnswer: 'A',
      explanation: 'Desalination requires intense electrical pressure and produces hyper-saline brine that harms marine sea floors if mismanaged.',
    },
    {
      question: 'How do urban permeable pavements assist in sustainable water management?',
      topic: 'water', level: 'intermediate',
      options: ['They allow rainwater to soak into the soil, recharging groundwater and reducing flash runoff floods', 'They collect water in underground diesel tanks', 'They evaporate rain before it hits the ground', 'They block all rain infiltration'],
      correctAnswer: 'A',
      explanation: 'Porous asphalt and pavers mimic natural ground, absorbing storm runoff and preventing urban sewer overflows.',
    },
    {
      question: 'What process causes dead zones in lakes and coastal bays when agricultural fertilizer runs off into rivers?',
      topic: 'water', level: 'intermediate',
      options: ['Eutrophication', 'Salinization', 'Transpiration', 'Acid deposition'],
      correctAnswer: 'A',
      explanation: 'Excess nitrogen and phosphorus fuel massive algae blooms; decomposing algae starves aquatic life of oxygen (hypoxia).',
    },

    // WATER CONSERVATION - Advanced
    {
      question: 'What hydrological equation calculates natural watershed runoff response to precipitation changes?',
      topic: 'water', level: 'advanced',
      options: ['Water Balance Equation (P = Q + ET + ΔS)', 'Bernoulli hydrodynamics', 'Darcy flux law', 'Manning roughness velocity'],
      correctAnswer: 'A',
      explanation: 'The mass conservation water balance equates Precipitation (P) to Runoff (Q), Evapotranspiration (ET), and Storage change (ΔS).',
    },
    {
      question: 'What membrane pore size distinguishes Reverse Osmosis (RO) from Nanofiltration (NF) in advanced water purification?',
      topic: 'water', level: 'advanced',
      options: ['RO pores (< 0.001 microns) reject monovalent ions like Na+, while NF rejects divalent ions', 'NF rejects all water molecules', 'RO allows bacteria to pass', 'NF requires high temperatures'],
      correctAnswer: 'A',
      explanation: 'RO membranes have tight pore matrices capable of separating single dissolved salt ions from water.',
    },
    {
      question: 'What is Integrated Water Resources Management (IWRM)?',
      topic: 'water', level: 'advanced',
      options: ['A holistic framework coordinating water, land, and economic development to maximize equitable welfare without compromising ecosystems', 'Privatizing all freshwater springs', 'Damming all major rivers', 'Diverting rivers across desert continents'],
      correctAnswer: 'A',
      explanation: 'IWRM promotes cross-sectoral management of watersheds balancing social equity, economic efficiency, and environmental sustainability.',
    },
    {
      question: 'How does global warming affect snowpack water storage in alpine mountain ranges?',
      topic: 'water', level: 'advanced',
      options: ['It shifts winter snow to rain and causes earlier spring melt, reducing summer river availability', 'It doubles winter snow depth', 'It prevents all spring runoff', 'It locks water permanently in ice'],
      correctAnswer: 'A',
      explanation: 'Warmer winter temperatures reduce natural snowpack storage, disrupting summer reservoir supply cycles for downstream regions.',
    },
    {
      question: 'What passive nature-based solution uses constructed wetlands to treat municipal wastewater naturally?',
      topic: 'water', level: 'advanced',
      options: ['Phytoremediation wetlands utilizing marsh plants and microbial beds', 'Deep-well liquid injection', 'Chlorination lagoons', 'Electro-coagulation units'],
      correctAnswer: 'A',
      explanation: 'Constructed wetlands leverage plant roots and soil bacteria to filter pathogens and nutrients naturally without synthetic chemicals.',
    },

    // BIODIVERSITY - Beginner
    {
      question: 'What term describes the variety of all living species, ecosystems, and genetic traits on Earth?',
      topic: 'biodiversity', level: 'beginner',
      options: ['Biodiversity', 'Biomass index', 'Monoculture', 'Biosphere radius'],
      correctAnswer: 'A',
      explanation: 'Biodiversity encompasses species richness, genetic variation, and ecosystem diversity across the biosphere.',
    },
    {
      question: 'What human driver is the leading cause of terrestrial animal species extinction worldwide?',
      topic: 'biodiversity', level: 'beginner',
      options: ['Habitat destruction and land conversion', 'Wildlife photography', 'Binocular observations', 'Eco-tourism hikes'],
      correctAnswer: 'A',
      explanation: 'Clearing forests and habitats for agriculture and urban sprawl is the main threat to global terrestrial species.',
    },
    {
      question: 'Why are coral reefs often referred to as the rainforests of the sea?',
      topic: 'biodiversity', level: 'beginner',
      options: ['They harbor over 25% of all ocean marine life despite covering under 1% of the seafloor', 'Trees grow inside underwater corals', 'They produce rainforest fruit underwater', 'They exist only in tropical rivers'],
      correctAnswer: 'A',
      explanation: 'Coral reef ecosystems support immense marine biodiversity, nursery grounds, and coastal food chains.',
    },
    {
      question: 'What happens when an invasive non-native species is introduced into a new ecosystem with no natural predators?',
      topic: 'biodiversity', level: 'beginner',
      options: ['It multiplies rapidly, outcompeting native species for food and shelter', 'It instantly transforms into a native species', 'It increases native biodiversity', 'It stops reproducing completely'],
      correctAnswer: 'A',
      explanation: 'Invasive species disrupt local food webs because native wildlife lack natural defenses or competitive adaptations against them.',
    },
    {
      question: 'How do wild bees, butterflies, and bats support global human food supply?',
      topic: 'biodiversity', level: 'beginner',
      options: ['By pollinating crops responsible for fruits, vegetables, and nuts', 'By filtering agricultural irrigation water', 'By aerating underground aquifers', 'By neutralizing pesticide runoff'],
      correctAnswer: 'A',
      explanation: 'Animal pollinators enable fertilization for over 75% of global flowering food crops.',
    },

    // BIODIVERSITY - Intermediate
    {
      question: 'What is a keystone species in ecology?',
      topic: 'biodiversity', level: 'intermediate',
      options: ['A species whose presence exerts strong disproportionate control on maintaining ecosystem structure', 'The most abundant animal species in a forest', 'An invasive plant species', 'A species raised exclusively in captivity'],
      correctAnswer: 'A',
      explanation: 'Keystone species (like sea otters or wolves) maintain habitat balance; their removal causes ecosystem collapse.',
    },
    {
      question: 'What ecosystem service do coastal mangrove forests provide to shorelines during ocean storm surges?',
      topic: 'biodiversity', level: 'intermediate',
      options: ['Dense root systems absorb wave energy, preventing coastal erosion and protecting inland communities', 'Mangroves heat shallow ocean bays', 'Mangroves push storm clouds back to sea', 'Mangroves produce sea salt'],
      correctAnswer: 'A',
      explanation: 'Mangrove roots dissipate surge energy, trap coastal sediments, and sequester carbon five times faster than terrestrial forests.',
    },
    {
      question: 'What ocean event occurs when prolonged thermal marine heatwaves cause corals to expel their symbiotic algae?',
      topic: 'biodiversity', level: 'intermediate',
      options: ['Coral Bleaching', 'Coral spawning', 'Hydrothermal venting', 'Sub-surface upwelling'],
      correctAnswer: 'A',
      explanation: 'Heat stress forces corals to eject zooxanthellae algae, turning corals white and starving them of photosynthetic nutrients.',
    },
    {
      question: 'What conservation strategy creates protected wilderness corridors connecting isolated animal habitats?',
      topic: 'biodiversity', level: 'intermediate',
      options: ['Wildlife Corridors (Habitat Connectivity)', 'Land fragmentation', 'Fenced monoculture reserves', 'Urban perimeter walls'],
      correctAnswer: 'A',
      explanation: 'Habitat corridors allow animals to migrate, hunt, and mate safely between fragmented natural parks.',
    },
    {
      question: 'What environmental concept calculates the economic and social benefits provided free by healthy natural ecosystems?',
      topic: 'biodiversity', level: 'intermediate',
      options: ['Ecosystem Services Valuation', 'Gross Domestic Product (GDP)', 'Resource depletion credit', 'Carbon tax refund'],
      correctAnswer: 'A',
      explanation: 'Ecosystem services value benefits like clean water filtration, crop pollination, and carbon storage provided by nature.',
    },

    // BIODIVERSITY - Advanced
    {
      question: 'What ecological collapse phenomenon occurs when top predator removal causes unchecked herbivore populations to decimate vegetation?',
      topic: 'biodiversity', level: 'advanced',
      options: ['Trophic Cascade', 'Competitive exclusion principle', 'Ecological succession', 'Biomagnification peak'],
      correctAnswer: 'A',
      explanation: 'Trophic cascades trigger reciprocal shifts across food chains when top apex predators are removed or restored.',
    },
    {
      question: 'What critical Amazon basin tipping point risk is threatened by combined deforestation and climate warming?',
      topic: 'biodiversity', level: 'advanced',
      options: ['Dieback transition from rainforest to degraded savanna', 'Instant glaciation', 'Conversion into an ocean bay', 'Permanent cloud cover formation'],
      correctAnswer: 'A',
      explanation: 'Loss of evapotranspiration moisture loops risks flipping the Amazon rainforest into a dry savanna carbon-emitting biome.',
    },
    {
      question: 'What global policy objective under the UN Convention on Biological Diversity targets protecting 30% of land and oceans by 2030?',
      topic: 'biodiversity', level: 'advanced',
      options: ['The 30x30 Target (Kunming-Montreal Global Biodiversity Framework)', 'The Kyoto Protocol', 'The Paris Accord Article 6', 'The RAMSAR wetland directive'],
      correctAnswer: 'A',
      explanation: 'The 30x30 milestone commits nations to designate 30% of global marine and terrestrial habitats as protected reserves by 2030.',
    },
    {
      question: 'What ecological metric measures species loss rates relative to the natural background fossil record baseline?',
      topic: 'biodiversity', level: 'advanced',
      options: ['Extinctions Per Million Species-Years (E/MSY)', 'Shannon diversity index', 'Simpson dominance scale', 'Biomagnification coefficient'],
      correctAnswer: 'A',
      explanation: 'E/MSY quantifies current extinction rates, showing human-caused species loss is 100 to 1,000 times higher than background background levels.',
    },
    {
      question: 'How does ocean plastic pollution cause biomagnification in marine food webs?',
      topic: 'biodiversity', level: 'advanced',
      options: ['Lipophilic toxic chemicals adsorb onto microplastics, concentrating in higher apex marine predators as small prey are consumed', 'Plastics dissolve into seawater nutrients', 'Apex predators absorb plastics through gills', 'Microplastics evaporate into air'],
      correctAnswer: 'A',
      explanation: 'Persistent organic pollutants bind to ingested microplastics, concentrating in higher concentrations up the marine food chain.',
    },

    // ECO-TRANSPORTATION - Beginner
    {
      question: 'Why is riding an electric city bus or train more sustainable than driving a single-occupancy gasoline car?',
      topic: 'transportation', level: 'beginner',
      options: ['Public transit carries many passengers at once, lowering greenhouse gas emissions per person-mile', 'Buses do not use any energy', 'Cars use more air than buses', 'Trains generate oxygen as they move'],
      correctAnswer: 'A',
      explanation: 'High-occupancy transit splits fuel consumption across dozens of commuters, dramatically reducing per-capita carbon output.',
    },
    {
      question: 'What type of personal transportation produces zero direct carbon emissions and improves physical health?',
      topic: 'transportation', level: 'beginner',
      options: ['Active Transportation (Walking and Bicycling)', 'Diesel motorcycles', 'Gasoline scooters', 'Idling idling sports cars'],
      correctAnswer: 'A',
      explanation: 'Walking and cycling use human energy directly, releasing zero tailpipe emissions.',
    },
    {
      question: 'What is a key environmental advantage of Electric Vehicles (EVs) over Internal Combustion Engine (ICE) vehicles?',
      topic: 'transportation', level: 'beginner',
      options: ['EVs have zero tailpipe emissions and become cleaner as the electrical grid transitions to renewables', 'EVs never need charging', 'EVs generate petroleum while driving', 'EVs absorb highway trash'],
      correctAnswer: 'A',
      explanation: 'EVs eliminate direct exhaust pollution and decouple vehicle miles from oil combustion.',
    },
    {
      question: 'What driving habit wastes vehicle fuel and generates unnecessary emissions while parked?',
      topic: 'transportation', level: 'beginner',
      options: ['Vehicle Idling (leaving the engine running while stopped)', 'Proper tire pressure inflation', 'Using cruise control on highways', 'Driving at steady speeds'],
      correctAnswer: 'A',
      explanation: 'Idling burns fuel uselessly, releasing carbon dioxide and smog-forming pollutants while remaining stationary.',
    },
    {
      question: 'How does carpooling with classmates or co-workers reduce urban environmental impact?',
      topic: 'transportation', level: 'beginner',
      options: ['It reduces the total number of cars on the road, decreasing traffic congestion and emissions', 'It doubles car engine speed', 'It eliminates the need for roads', 'It converts exhaust to steam'],
      correctAnswer: 'A',
      explanation: 'Sharing rides increases vehicle passenger occupancy, reducing traffic bottlenecks and per-commuter fuel burn.',
    },

    // ECO-TRANSPORTATION - Intermediate
    {
      question: 'What physical energy recovery process allows electric and hybrid vehicles to recharge batteries during deceleration?',
      topic: 'transportation', level: 'intermediate',
      options: ['Regenerative Braking', 'Hydraulic friction braking', 'Exhaust heat recycling', 'Inductive road coupling'],
      correctAnswer: 'A',
      explanation: 'Regenerative braking reverses electric motors into generators during braking, capturing kinetic energy as stored battery power.',
    },
    {
      question: 'What urban transit infrastructure design gives buses dedicated lane rights-of-way and priority traffic signals?',
      topic: 'transportation', level: 'intermediate',
      options: ['Bus Rapid Transit (BRT)', 'High-occupancy toll lanes', 'Suburban bypass ring roads', 'Park-and-ride commuter lots'],
      correctAnswer: 'A',
      explanation: 'BRT systems mimic metro rail speed and reliability above ground using dedicated bus corridors and signal priority.',
    },
    {
      question: 'Why does high-speed passenger rail emit significantly less carbon than short-haul domestic flights?',
      topic: 'transportation', level: 'intermediate',
      options: ['Electric rail draws efficient grid power and avoids high-altitude jet fuel combustion during aircraft takeoff', 'Trains fly closer to the ground', 'Airplane jet fuel contains no carbon', 'Rail tracks absorb CO2'],
      correctAnswer: 'A',
      explanation: 'Electric trains deliver high energy efficiency per passenger and eliminate high-altitude radiative forcing from jet exhaust.',
    },
    {
      question: 'How do urban Low Emission Zones (LEZs) incentivize cleaner transport choices in city centers?',
      topic: 'transportation', level: 'intermediate',
      options: ['By restricting or charging fees to high-polluting vehicles entering designated urban areas', 'By banning bicycles from downtown', 'By subsidizing diesel fuel for trucks', 'By eliminating parking meters'],
      correctAnswer: 'A',
      explanation: 'LEZs penalize older polluting engines, encouraging fleet upgrades to electric, hybrid, or active transit options.',
    },
    {
      question: 'What lifecycle phase accounts for the initial carbon debt of an Electric Vehicle before it is driven?',
      topic: 'transportation', level: 'intermediate',
      options: ['Battery raw material extraction and cell manufacturing', 'Shipment from dealership', 'Tire rubber synthesis', 'Windshield glass molding'],
      correctAnswer: 'A',
      explanation: 'Lithium, nickel, and cobalt mining and battery cell assembly create an upfront manufacturing carbon debt offset within 1–2 years of clean driving.',
    },

    // ECO-TRANSPORTATION - Advanced
    {
      question: 'What clean fuel alternative is leading candidate for decarbonizing long-distance transoceanic cargo ships?',
      topic: 'transportation', level: 'advanced',
      options: ['Green Ammonia (NH3) / E-Methanol', 'Compressed Compressed Natural Gas', 'Lithium battery packs only', 'Aviation kerosene'],
      correctAnswer: 'A',
      explanation: 'Zero-carbon green ammonia synthesized from renewable hydrogen provides the volumetric energy density required for ocean freight vessels.',
    },
    {
      question: 'What grid integration technology allows parked Electric Vehicles to supply power back to the grid during emergency peak loads?',
      topic: 'transportation', level: 'advanced',
      options: ['Vehicle-to-Grid (V2G) Bi-directional Charging', 'Inductive static pads', 'DC fast charging', 'Substation step-down transformation'],
      correctAnswer: 'A',
      explanation: 'V2G technology transforms EV fleets into distributed battery storage assets that stabilize power grid frequencies.',
    },
    {
      question: 'What synthetic fuel category is created by combining captured CO2 with green hydrogen for aviation use?',
      topic: 'transportation', level: 'advanced',
      options: ['Power-to-Liquid (PtL) E-Fuels / Sustainable Aviation Fuel (SAF)', 'Liquefied Petroleum Gas', 'Bio-methane gas', 'Refined bunker C fuel'],
      correctAnswer: 'A',
      explanation: 'PtL drop-in e-fuels replace conventional jet A-1 fuel without requiring aircraft engine redesigns.',
    },
    {
      question: 'What non-exhaust vehicle particle emission represents a growing source of microplastic pollution in roadways?',
      topic: 'transportation', level: 'advanced',
      options: ['Tire and brake wear friction particles', 'Exhaust soot agglomerates', 'Radiator coolant mist', 'Windshield wiper fluid spray'],
      correctAnswer: 'A',
      explanation: 'Friction wear from synthetic rubber tires and brake pads contributes significantly to urban airborne and aquatic microplastic runoff.',
    },
    {
      question: 'What transport modeling metric evaluates the proportion of city trips taken by active/public transit versus private cars?',
      topic: 'transportation', level: 'advanced',
      options: ['Modal Split (Modal Share)', 'Commute velocity quotient', 'Induced demand multiplier', 'Traffic queuing index'],
      correctAnswer: 'A',
      explanation: 'Modal split tracks the percentage of total urban journeys completed across different transit modes.',
    },

    // SUSTAINABLE LIVING - Beginner
    {
      question: 'Why does shifting toward a plant-rich diet reduce an individual environmental footprint?',
      topic: 'sustainable_living', level: 'beginner',
      options: ['Plant agriculture requires significantly less land, water, and energy than raising livestock', 'Plants do not require sunlight to grow', 'Animals absorb carbon dioxide', 'Plant foods contain no water'],
      correctAnswer: 'A',
      explanation: 'Livestock production generates methane and requires immense land resources for feed crops compared to direct human plant consumption.',
    },
    {
      question: 'What simple household habit prevents large volumes of food from spoiling and ending up in landfills?',
      topic: 'sustainable_living', level: 'beginner',
      options: ['Planning meals, storing food properly, and using leftovers', 'Buying food in bulk without meal plans', 'Throwing away food on expiration dates', 'Storing fruits in open sunlight'],
      correctAnswer: 'A',
      explanation: 'Meal planning and smart food storage eliminate consumer food waste, saving money and reducing methane emissions.',
    },
    {
      question: 'What water temperature setting for washing machines saves heating energy while cleaning clothes effectively?',
      topic: 'sustainable_living', level: 'beginner',
      options: ['Cold water wash (30°C / Cold cycle)', 'Boiling hot cycle (90°C)', 'Warm steam wash', 'Pre-heated sanitized wash'],
      correctAnswer: 'A',
      explanation: 'Around 75% to 90% of washing machine energy goes toward heating water; cold water washing cleans clothes while saving power.',
    },
    {
      question: 'What is conscious consumerism in sustainable daily living?',
      topic: 'sustainable_living', level: 'beginner',
      options: ['Making intentional purchasing decisions that favor durable, ethically made, and low-impact products', 'Buying every new gadget upon release', 'Purchasing fast fashion weekly', 'Using disposable paper plates daily'],
      correctAnswer: 'A',
      explanation: 'Conscious consumerism considers the ecological footprint, durability, and ethics of goods before purchasing.',
    },
    {
      question: 'What eco-friendly alternative replaces single-use plastic grocery bags during shopping trips?',
      topic: 'sustainable_living', level: 'beginner',
      options: ['Reusable canvas or cloth tote bags', 'Disposable paper sacks discarded after one use', 'Thin plastic produce bags', 'Single-use foil wraps'],
      correctAnswer: 'A',
      explanation: 'Using durable cloth bags repeatedly eliminates hundreds of single-use plastic bags per household annually.',
    },

    // SUSTAINABLE LIVING - Intermediate
    {
      question: 'What is the Fast Fashion industry primary environmental harm?',
      topic: 'sustainable_living', level: 'intermediate',
      options: ['Mass producing low-quality synthetic garments that drive massive textile waste, water pollution, and microplastic shed', 'Using too much organic cotton', 'Manufacturing clothes that last too long', 'Employing local tailors'],
      correctAnswer: 'A',
      explanation: 'Fast fashion relies on fossil-fuel polyester, rapid consumption cycles, and toxic dyes, filling landfills with synthetic textile waste.',
    },
    {
      question: 'How does seasonal and locally grown food purchasing lower a meal carbon footprint?',
      topic: 'sustainable_living', level: 'intermediate',
      options: ['It eliminates long-distance refrigerated transport (food miles) and energy-intensive heated greenhouse farming', 'Local food contains zero carbon atoms', 'Local crops do not require soil', 'Local food cooks instantly without heat'],
      correctAnswer: 'A',
      explanation: 'Eating local, seasonal produce reduces emissions from air-freight shipping, cold chain logistics, and artificial greenhouse heating.',
    },
    {
      question: 'What carbon accounting metric calculates an individual total direct and indirect annual greenhouse gas emissions?',
      topic: 'sustainable_living', level: 'intermediate',
      options: ['Personal Carbon Footprint (in metric tons CO2e)', 'Basal metabolic rate', 'Ecological trophic score', 'Consumer price index'],
      correctAnswer: 'A',
      explanation: 'Personal carbon footprint aggregates emissions from home energy, travel, diet, and goods purchasing into CO2 equivalent metrics.',
    },
    {
      question: 'How do smart programmable thermostats lower residential heating and cooling bills?',
      topic: 'sustainable_living', level: 'intermediate',
      options: ['They automatically adjust indoor temperatures based on occupancy schedules and nighttime setbacks', 'They generate supplementary solar heat', 'They lower outside humidity', 'They replace window glass'],
      correctAnswer: 'A',
      explanation: 'Smart thermostats reduce HVAC power consumption by setback adjustments when home occupants are asleep or away.',
    },
    {
      question: 'What community initiative allows households without suitable rooftops to share clean power from a central solar installation?',
      topic: 'sustainable_living', level: 'intermediate',
      options: ['Community Solar (Shared Solar Subscriptions)', 'Rooftop netting', 'Off-grid diesel cooperatives', 'Individual battery leasing'],
      correctAnswer: 'A',
      explanation: 'Community solar enables renters and apartment dwellers to subscribe to a local solar farm and receive electric bill credits.',
    },

    // SUSTAINABLE LIVING - Advanced
    {
      question: 'In corporate and individual carbon accounting, what defines Scope 3 indirect emissions?',
      topic: 'sustainable_living', level: 'advanced',
      options: ['All indirect supply chain emissions across product extraction, material processing, transport, and consumer end-of-use', 'Direct fuel burned in company vehicles (Scope 1)', 'Purchased grid electricity (Scope 2)', 'Emissions from breathing'],
      correctAnswer: 'A',
      explanation: 'Scope 3 encompasses value chain emissions outside direct operations, often accounting for 80%+ of total lifecycle impact.',
    },
    {
      question: 'What ultra-low energy building standard mandates airtight envelopes, triple-pane windows, and heat recovery ventilation?',
      topic: 'sustainable_living', level: 'advanced',
      options: ['Passive House Standard (Passivhaus)', 'LEED Silver certification', 'Energy Star basic tier', 'Standard building code 2000'],
      correctAnswer: 'A',
      explanation: 'Passive House design achieves up to 90% space heating savings through extreme envelope insulation and heat recovery ventilation.',
    },
    {
      question: 'What environmental science framework establishes 9 critical global thresholds necessary to maintain Earth Holocene stability?',
      topic: 'sustainable_living', level: 'advanced',
      options: ['The Planetary Boundaries Framework (Stockholm Resilience Centre)', 'The Doughnut Economics core index', 'The IPCC Scenario matrix', 'The UN SDG 17 points'],
      correctAnswer: 'A',
      explanation: 'The Planetary Boundaries framework defines 9 safe operating limits including climate, freshwater, land system use, and novel entities.',
    },
    {
      question: 'What standardized methodology measures environmental impacts across all stages of a product life from raw extraction to disposal?',
      topic: 'sustainable_living', level: 'advanced',
      options: ['Life Cycle Assessment (LCA - ISO 14040/44)', 'Material Safety Data Sheet (MSDS)', 'Environmental Impact Statement (EIS)', 'Supply Chain Audit'],
      correctAnswer: 'A',
      explanation: 'LCA compiles energy, material inputs, and environmental outputs across raw material acquisition, manufacturing, use, and end-of-life.',
    },
    {
      question: 'How does behavioral choice architecture (Nudge Theory) accelerate sustainable lifestyle adoption in communities?',
      topic: 'sustainable_living', level: 'advanced',
      options: ['By altering default options to eco-friendly choices (e.g. green energy opt-out defaults) without restricting consumer freedom', 'By levying heavy criminal fines', 'By rationing grocery purchases', 'By banning public advertising'],
      correctAnswer: 'A',
      explanation: 'Nudge theory modifies default options so sustainable choices become the easiest, friction-free path for individuals.',
    },
  ];

  // Clean duplicate questions if any exist in DB
  await QuestionModel.deleteMany({});
  await QuizAttempt.deleteMany({});

  // Perform duplicate detection & normalization check
  const normalizedSeen = new Set<string>();
  let duplicateCount = 0;
  let uniqueCount = 0;

  const topicCounts: Record<string, number> = {};
  const difficultyCounts: Record<string, number> = {};

  for (const q of rawQuestionsData) {
    const normKey = q.question.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    if (normalizedSeen.has(normKey)) {
      duplicateCount++;
    } else {
      normalizedSeen.add(normKey);
      uniqueCount++;
      await QuestionModel.create(q);

      topicCounts[q.topic] = (topicCounts[q.topic] || 0) + 1;
      difficultyCounts[q.level] = (difficultyCounts[q.level] || 0) + 1;
    }
  }

  console.log('====================================================');
  console.log('            GREVIA SEED STATISTICAL REPORT          ');
  console.log('====================================================');
  console.log(`Total Questions Ingested: ${rawQuestionsData.length}`);
  console.log(`Unique Questions Created:  ${uniqueCount}`);
  console.log(`Duplicate Questions Found: ${duplicateCount}`);
  console.log('----------------------------------------------------');
  console.log('Questions By Topic:');
  Object.entries(topicCounts).forEach(([t, count]) => {
    console.log(`  - ${t.padEnd(20)}: ${count}`);
  });
  console.log('----------------------------------------------------');
  console.log('Questions By Difficulty:');
  Object.entries(difficultyCounts).forEach(([d, count]) => {
    console.log(`  - ${d.padEnd(20)}: ${count}`);
  });
  console.log('====================================================');
  console.log('[Seed] Database seeding completed successfully!');
};

if (require.main === module) {
  (async () => {
    try {
      await connectDB();
      await seedDatabase();
      await disconnectDB();
      process.exit(0);
    } catch (err) {
      console.error('[Seed] Error seeding database:', err);
      process.exit(1);
    }
  })();
}