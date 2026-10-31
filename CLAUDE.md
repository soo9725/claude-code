# CLAUDE.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

---

# Workflow rules

## Environment
- The user works on Windows 11 in the VS Code extension. Read ~/.claude/environment.md before you choose commands, tools, or library versions.
- Before you use a library, check its setup and version with Context7. Check that it runs on this machine (see environment.md).

## Plan file
- Each project has a plan.md. Exception: the ~/.claude folder.
- The project CLAUDE.md names the location. The default is the project root.
- When plan.md exists, read it first in each session.
- When plan.md does not exist and the user describes a project to build, or runs /grill-me: create plan.md first. Settle each decision with the user by the /grill-me method. Do not write code before plan.md exists.
- Write each decision in plan.md. Mark each fact as verified or not verified.
- Mark finished items "완료". Remove parts that are no longer needed.

## Steps
- One item in the plan's order of work is one step.
- Before a step, ask one time: "Start this step?" Show the completion criteria and the test list.
- After approval, do the whole step: write code, run checks, fix errors, run the evaluation, commit locally.
- In an approved step, do not ask about small choices. Put each assumption in the report.
- Stop and ask when:
  1. Something is unclear, a decision is missing, or the plan and the design files disagree.
  2. 3 check runs fail in a row.
  3. A command is not allowed.
  4. You must push.
- Commit locally when the checks pass. Commit often.
- Push one time at the end of a step, after the user approves.

## Verification
- Write the completion criteria before the code.
- Loop until verified (guideline 4). Stop after 3 failed check runs in a row.
- Do not change a test to make it pass. If a test is wrong, stop and tell the user.
- Use a separate agent to design tests from plan.md. Use a separate agent (opus) to evaluate.
- Write "evaluation agent: used" or "not used" in every report.
- Write a check that you did not run as "확인 못 함". Do not conclude "absent" from missing evidence.

## Safety
- Change ~/.claude only when the user asks.
- Ask before delete commands, git push, and package installs.
- Do not print tokens. Keep private notes in a git-ignored file.
- Before a push, run git status. Check for renamed or new files.

## Report format (write in Korean)
단계 / 검사 결과(PASS·FAIL) / 평가 에이전트 사용 여부와 판정 / 사용자가 직접 확인할 항목 / 계획서에 없는 사례
