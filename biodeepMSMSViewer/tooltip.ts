namespace BioDeep.MSMSViewer {

    export function tooltip(mz: Data.mzData): d3.Tooltip {
        var tip = d3.tip()
            .attr("class", "d3-tip")
            .offset([-10, 0])
            .html(d => {
                return mz.tooltip(<BioDeep.Models.mzInto>d);
            });

        return tip;
    }

    export function mzrtTip(): d3.Tooltip {
        var tip = d3.tip()
            .attr("class", "d3-tip")
            .offset([-10, 0])
            .html(function (d: IO.mgf) {
                return `${d.precursor_mass}@${d.rt}`;
            });

        return tip;
    }
}