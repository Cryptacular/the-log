export const initialEditorValue = JSON.stringify({
  document: {
    nodes: [
      {
        nodes: [
          {
            leaves: [
              {
                text: "Add your first task here"
              }
            ],
            object: "text"
          }
        ],
        object: "block",
        type: "task"
      },

      {
        nodes: [
          {
            leaves: [
              {
                text:
                  "Then press Ctrl/Cmd+D to complete the task, like this one!"
              }
            ],
            object: "text"
          }
        ],
        object: "block",
        type: "done"
      }
    ]
  }
});
