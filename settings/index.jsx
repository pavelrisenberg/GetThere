function mySettings(props) {
  return (
    <Page>
      <Section
        title={<Text bold align="left">Destination Coordinates</Text>}>
        <Text>Enter latitude and longitude of the destination you'd like to get to. Learning geography is an added benefit!</Text>
        <TextInput label="Latitude" placeholder="55.7558" settingsKey="latitude"/>
        <TextInput label="Longitude" placeholder="37.6173" settingsKey="longitude"/>
      </Section>
    </Page>
  );
}

registerSettingsPage(mySettings);
