
      const aceEditor = ace.edit("code-editor", {
        theme: "ace/theme/cobalt",
        mode: "ace/mode/mysql",
        showLineNumbers: true,
        showGutter: true,
        useSoftTabs: true 
      });

      aceEditor.setValue(
        `SELECT * FROM users WHERE age > 18;`
      );

    //   const runCodeButton = document.getElementById("run-code");
    //   const outputElement = document.getElementById("output");

    //   // Handle Run Query button click
    //   runCodeButton.addEventListener("click", () => {
    //     const userCode = aceEditor.getValue(); // Get the query from the editor
    //     outputElement.textContent = "";

    //     try {
    //       // Simulating SQL execution as browsers cannot run SQL directly
    //       const result = `Simulated execution of:\n${userCode}`;
    //       outputElement.textContent = result;
    //     } catch (error) {
    //       outputElement.textContent = `Error:\n${error.message}`;
    //     }
    //   });