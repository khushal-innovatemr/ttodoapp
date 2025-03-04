import { Strategy } from './strategy';
import { Context } from '../context';
export default class GradualRolloutRandomStrategy extends Strategy {
    private randomGenerator;
    constructor(randomGenerator?: Function);
    isEnabled(parameters: any, context: Context): boolean;
}
//# sourceMappingURL=gradual-rollout-random.d.ts.map