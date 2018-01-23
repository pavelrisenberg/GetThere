function mySettings(props) {
  return (
    <Page>
      <Section
        title={<Text bold align="center">Destination Coordinates</Text>}>
        <Text>Enter name, latitude and longitude of each destination you'd like to track time to. 
          Learning geography is an added benefit!</Text>
      </Section>
      <Section title={<Text bold align="left">Destination #1</Text>}>
        <TextInput label="Name" placeholder="Home" settingsKey="destination_name1"/>
        <TextInput label="Address" placeholder="199 Fremont, San Francisco" settingsKey="address1"/>
      </Section>
      <Section title={<Text bold align="left">Destination #2</Text>}>
        <TextInput label="Name" placeholder="Work" settingsKey="destination_name2"/>
        <TextInput label="Address" placeholder="199 Fremont, San Francisco" settingsKey="address2"/>
      </Section>
      <Section title={<Text bold align="left">Destination #3</Text>}>
        <TextInput label="Name" placeholder="Secret Place" settingsKey="destination_name3"/>
        <TextInput label="Address" placeholder="215 Fremont, San Francisco" settingsKey="address3"/>
      </Section>
    </Page>
  );
}

registerSettingsPage(mySettings);
