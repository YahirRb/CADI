const handleEnterKeydown = (event: React.KeyboardEvent<HTMLInputElement>) => {
  if (event.key == "Enter") {
    const submitButton = document.getElementById("login-submit") as HTMLElement;
    submitButton.click();
  }
};

export default handleEnterKeydown;
