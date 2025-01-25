import {
  history,
  historyKeymap,
  indentWithTab,
  standardKeymap,
} from "@codemirror/commands";
import { EditorView, keymap, drawSelection } from "@codemirror/view";
import { closeBrackets, closeBracketsKeymap } from "@codemirror/autocomplete";
import {
  defaultHighlightStyle,
  syntaxHighlighting,
  indentOnInput,
  indentUnit,
} from "@codemirror/language";
import { python } from "@codemirror/lang-python";

export const createEditor = ({ extensions, ...opts }) =>
  new EditorView({
    extensions: [
      history(),
      drawSelection(),
      indentOnInput(),
      indentUnit.of("    "),
      closeBrackets(),
      syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
      keymap.of([
        ...closeBracketsKeymap,
        ...standardKeymap,
        ...historyKeymap,
        indentWithTab,
      ]),
      python(),
      ...(extensions ?? []),
    ],
    ...opts,
  });
