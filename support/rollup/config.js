import factory from './factory'
import slateAutoReplace from '../../packages/slate-auto-replace/package.json'
import slateCollapseOnEscape from '../../packages/slate-collapse-on-escape/package.json'
import slateDropOrPasteImages from '../../packages/slate-drop-or-paste-images/package.json'
import slateListBehavior from '../../packages/slate-list-behavior/package.json'
import slatePasteLinkify from '../../packages/slate-paste-linkify/package.json'
import slateQuoteBehavior from '../../packages/slate-quote-behavior/package.json'
import slateSoftBreak from '../../packages/slate-soft-break/package.json'
import slateWhen from '../../packages/slate-when/package.json'

const configurations = [
  ...factory(slateAutoReplace),
  ...factory(slateCollapseOnEscape),
  ...factory(slateDropOrPasteImages),
  ...factory(slateListBehavior),
  ...factory(slatePasteLinkify),
  ...factory(slateQuoteBehavior),
  ...factory(slateSoftBreak),
  ...factory(slateWhen),
]

export default configurations
