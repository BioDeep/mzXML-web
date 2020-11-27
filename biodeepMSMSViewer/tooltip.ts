namespace BioDeep.MSMSViewer {

    export function tooltip(mz: Data.mzData): d3.Tooltip {
        let tip = d3.tip()
            .attr("class", "d3-tip")
            .offset([-10, 0])
            .html(d => mz.tooltip(<BioDeep.Models.mzInto>d))
            ;

        return tip;
    }

    export function mzrtTip(): d3.Tooltip {
        let tip = d3.tip()
            .attr("class", "d3-tip")
            .offset([-10, 0])
            .html((d: IO.mgf) => `${d.precursor_mass}@${d.rt}`)
            ;

        return tip;
    }
}