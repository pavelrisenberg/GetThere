function mySettings(props) {
  return (
    <Page>
      <Section
        title={<Text bold align="left">Destinations</Text>}>
        <Text>Let's start here. Enter address for each destination you'd like to track time in route to.</Text>
      </Section>
      <Section title={<Text bold align="left">Destination #1</Text>}>
        <TextInput label="Name" placeholder="Home" settingsKey="destination_name1"/>
        <TextInput label="Address (Coordinates)" placeholder="199 Fremont, San Francisco" settingsKey="address1"/>
      </Section>
      <Section title={<Text bold align="left">Destination #2</Text>}>
        <TextInput label="Name" placeholder="Work" settingsKey="destination_name2"/>
        <TextInput label="Address (Coordinates)" placeholder="199 Fremont, San Francisco" settingsKey="address2"/>
      </Section>
      <Section title={<Text bold align="left">Destination #3</Text>}>
        <TextInput label="Name" placeholder="Secret Place" settingsKey="destination_name3"/>
        <TextInput label="Address (Coordinates)" placeholder="199 Fremont, San Francisco" settingsKey="address3"/>
      </Section>
      <Section title={<Text bold align="left">Rules of the road</Text>}>
        <Text>1. Whenever traffic information will be unavailable to the destination, the duration will have "*" sign in the app.</Text>
        <Text>2. Destinations that are &lt;1 km away will be hidden (just get some steps and you're there).</Text>
      </Section>  
      <Section title={<Text bold align="left">Settings</Text>}>
        <Toggle settingsKey="unit_system" label="Miles/feet"/>
        <Toggle settingsKey="time_system" label="AM/PM"/>        
      </Section>
    </Page>
  );
}

registerSettingsPage(mySettings);
